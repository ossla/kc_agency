import fileUpload from "express-fileupload"
import * as path from "path"
import * as fs from "fs"
import { CreateEmployeeType } from "../employee/employeeTypes"
import { CreateActorType } from "../actor/actorTypes"
import ApiError from "../../error/apiError"
import { resizeAndSave } from "../actor/sharp"


// код для работы с файлами на сервере (server/static)

export function returnStaticPath(): string {
    const pathToStatic: string = path.join(__dirname, "..", "..", "..", "static")
    if (!fs.existsSync(pathToStatic)) {
        fs.mkdirSync(pathToStatic)
    }
    return pathToStatic
}

export type CustomFileType = fileUpload.UploadedFile 
                            | fileUpload.UploadedFile[]
                            | undefined

export async function savePhoto(photo: CustomFileType
                    , photoName: string, folderName: string = "") {
    folderName = path.join(returnStaticPath(), folderName)

    const filepath: string = path.join(folderName, photoName)
    if (fs.existsSync(filepath)) {
        throw ApiError.badRequest("savePhoto: Фото с таким именем уже существует: " + photoName)
    }
    if (photo) {
        if (Array.isArray(photo)) {
            throw ApiError.badRequest("savePhoto: загрузите только 1 файл")
        }
        await photo.mv(filepath)
    } else {
        throw ApiError.badRequest("savePhoto: загрузите фото")
    }
}

export async function removePhoto(photoName: string, folderName: string = "") {
    if (folderName === "") { folderName = returnStaticPath() }
    console.log(photoName)

    const filepath: string = path.join(folderName, photoName)
    if (!fs.existsSync(filepath)) {
        console.error("removePhoto: Фото с таким именем нет: " + photoName)
    } else {
        fs.rmSync(filepath)
    }
}

export function makeActorDirname(body: CreateActorType): string {
    return body.firstName + body.lastName
}

export async function makeActorDirectory(body: CreateActorType): Promise<string> {
    const dirname: string = crypto.randomUUID()
    const dirPath: string = path.join(returnStaticPath(), dirname)
    
    if (fs.existsSync(dirPath)) {
        throw ApiError.badRequest("makeActorDirectory: папка с таким именем существует: " + dirPath) // :)
    }

    fs.mkdirSync(dirPath)

    return dirname
}

export async function removeActorFolder(dirname: string): Promise<void> {
    const dirPath: string = path.join(returnStaticPath(), dirname)

    if (!fs.existsSync(dirPath)) {
        console.error("removeActorFolder: нет такой папки: ", dirPath)
    } else {
        try {
            fs.rmSync(dirPath, { recursive: true, force: true })
        } catch (error: any) {
            console.error(error)
        }
    }
}

export async function saveActorPhotos(photos: CustomFileType, dirname: string): Promise<string[]> {
    const dirPath = path.join(returnStaticPath(), dirname)
    const filenames: string[] = []
    
    if (!Array.isArray(photos)) {
        const filename = '1.jpg'
        await photos.mv(path.join(dirPath, filename))
        filenames.push(filename)
    } else {
        if (photos.length > 40) {
            throw ApiError.badRequest("saveActorPhotos: Загружено более 40 фото")
        }

        for (let i = 0; i < photos.length; i++) {
            const uuid: string = crypto.randomUUID()

            await resizeAndSave(photos[i].data, dirPath, uuid)

            filenames.push(uuid)
        }
    }
    return filenames
}

export async function changePhoto(newPhoto: CustomFileType, filename: string, directory?: string,) {
    const filepath = directory
        ? path.join(returnStaticPath(), directory, filename)
        : path.join(returnStaticPath(), filename)

    if (!fs.existsSync(filepath)) {
        throw ApiError.badRequest(`changePhoto: Файл ${filepath} не существует`)
    }

    if (!Array.isArray(newPhoto)) {
        fs.rmSync(filepath)
        await newPhoto.mv(filepath)
    } else {
        throw ApiError.badRequest("changePhoto: ожидался одиночный файл")
    }
}