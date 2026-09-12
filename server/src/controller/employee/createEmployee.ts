import { NextFunction, Response } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { createEmployeeSchema, CreateEmployeeType } from "./employeeTypes"
import { appDataSource } from "../../data-source"
import { Employee } from "../../models/employee.entity"
import { CustomFileType, /** makeEmployeePhotoName,*/ removePhoto, savePhoto } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


export async function createEmployee(req: ICustomRequest, res: Response, next: NextFunction) {
    let photoName: string = ""
    try {
        console.log("[createEmployee] create employee controller starts...")
        const body: CreateEmployeeType = createEmployeeSchema.parse(req.body)

        console.log("[createEmployee] getting data from sql...")
        const is_exist = await appDataSource.getRepository(Employee)
                                            .findOne({where: {email: body.email}})
        if (is_exist) throw new Error('Пользователь с таким email уже существует')

        console.log("[createEmployee] saving photo...")
        const photo: CustomFileType = req.files?.photo
        if (!photo) {
            throw ApiError.badRequest("Необходимо добавить поле photo для загрузки аватара")
        }
        photoName = crypto.randomUUID()
        await savePhoto(photo, photoName)
        console.log("[createEmployee] photo saved.")

        console.log("[createEmployee] creating employee...")
        const employee: Employee = new Employee()
        employee.firstName = body.firstName
        console.log("[createEmployee] firstName saved.")
        employee.lastName = body.lastName
        console.log("[createEmployee] lastName saved.")
        employee.middleName = body.middleName ?? null
        console.log("[createEmployee] middleName saved.")
        employee.email = body.email
        console.log("[createEmployee] email saved.")
        employee.phone = body.phone
        console.log("[createEmployee] phone saved.")
        employee.description = body.description ?? null
        console.log("[createEmployee] description saved.")
        employee.photo = photoName
        console.log("[createEmployee] photo saved.")
        employee.telegram = body.telegram ?? null
        console.log("[createEmployee] telegram saved.")
        employee.vk = body.vk ?? null
        console.log("[createEmployee] vk saved.")
        employee.instagram = body.vk ?? null
        console.log("[createEmployee] instagram saved.")
        employee.facebook = body.vk ?? null
        console.log("[createEmployee] facebook saved.")

        await appDataSource.getRepository(Employee).save(employee).catch((error) => {
            console.error("[createEmployee] error while saving employee:", error)
            throw error
        })
        res.status(201).json(employee)

    } catch (error: any) {
        console.log("[createEmployee] error.")
        if (photoName != "") {
            console.log("[createEmployee] removePhoto...")
            await removePhoto(photoName)
        }
        throw error
    }
} // create
