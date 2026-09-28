import { Request, Response } from "express"
import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import sharp from "sharp"
import { appDataSource } from "../../data-source"
import { getEmployee } from "./getEmployee"
import { Employee } from "../../models/employee.entity"
import { savePhoto, returnStaticPath } from "../services/fileSystemService"
import { editEmployeeSchema } from "./employeeTypes"
import ApiError from "../../error/apiError"

async function cleanPhoto(name: string) {
    if (!/^[\w-]+$/.test(name)) return
    await Promise.all([400, 1600].map(size =>
        fs.unlink(path.join(returnStaticPath(), `${name}_${size}.jpg`)).catch(error => {
            if (error.code !== "ENOENT") console.error("[editEmployee] photo cleanup failed", error)
        }),
    ))
}

export async function editEmployee(req: Request, res: Response) {
    const { id, ...changes } = editEmployeeSchema.parse(req.body)
    const avatar = req.files?.newAvatar
    if (Array.isArray(avatar)) throw ApiError.badRequest("Выберите только одно фото")
    if (avatar && (avatar.truncated || avatar.size > 20 * 1024 ** 2)) {
        throw ApiError.badRequest("Выберите одно фото размером до 20 МБ")
    }
    let newPhoto: string | undefined
    let oldPhoto: string | undefined
    try {
        if (avatar) {
            const metadata = await sharp(avatar.data).metadata().catch(() => {
                throw ApiError.badRequest("Не удалось прочитать фото. Выберите JPG, PNG или WebP")
            })
            if (!["jpeg", "png", "webp"].includes(metadata.format)) {
                throw ApiError.badRequest("Выберите фото в формате JPG, PNG или WebP")
            }
            newPhoto = randomUUID()
            await savePhoto(avatar, newPhoto)
        }
        await appDataSource.transaction(async manager => {
            const employee = await manager.createQueryBuilder(Employee, "employee")
                .setLock("pessimistic_write").where("employee.id = :id", { id }).getOne()
            if (!employee) throw new ApiError(404, "Агент не найден")
            if (newPhoto) oldPhoto = employee.photo
            if (newPhoto || Object.keys(changes).length) {
                await manager.update(Employee, id, { ...changes, ...(newPhoto ? { photo: newPhoto } : {}) })
            }
        })
        // Keep the new file after commit; only then remove the previous avatar.
        newPhoto = undefined
        if (oldPhoto) await cleanPhoto(oldPhoto)
        res.json(await getEmployee(id))
    } catch (error) {
        if (newPhoto) await cleanPhoto(newPhoto)
        if ((error as { code?: string }).code === "23505") {
            throw new ApiError(409, "Агент с таким email или телефоном уже существует")
        }
        throw error
    }
}
