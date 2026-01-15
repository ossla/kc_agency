import fileUpload from "express-fileupload"
import * as path from "path"
import * as fs from "fs"
import { CreateEmployeeType } from "../employee/employeeTypes"
import { CreateActorType } from "../actor/actorTypes"
import ApiError from "../../error/apiError"
import { resizeAndSave } from "../actor/sharp"


// код для работы с файлами на сервере (server/uploads)

export function returnStaticPath(): string {
    const pathToStatic: string = path.join(__dirname, "..", "..", "..", "uploads")
    if (!fs.existsSync(pathToStatic)) {
        fs.mkdirSync(pathToStatic)
    }
    return pathToStatic
}

export type CustomFileType = fileUpload.UploadedFile 
                            | fileUpload.UploadedFile[]
                            | undefined

export async function savePhoto(photo: CustomFileType
                    , photoName: string, dirName: string = "") {
    console.log("[savePhoto] start...")
    const dirPath: string = path.join(returnStaticPath(), dirName)

    const filepath: string = path.join(dirPath, photoName)
    console.log("[savePhoto] avatar file path: " + filepath)

    if (fs.existsSync(filepath)) {
        throw ApiError.badRequest("[savePhoto] Фото с таким именем уже существует: " + photoName)
    }
    if (photo) {
        if (Array.isArray(photo)) {
            throw ApiError.badRequest("[savePhoto] загрузите только 1 файл")
        }

        await resizeAndSave(photo.data, dirPath, photoName)
    } else {
        throw ApiError.badRequest("savePhoto: загрузите фото")
    }
    console.log("[savePhoto] end")

}

export async function removePhoto(photoName: string, dirName: string = "") {
    if (dirName === "") { dirName = returnStaticPath() }
    console.log("[removePhoto] photoName: " + photoName)

    const filepath: string = path.join(dirName, photoName)
    if (!fs.existsSync(filepath)) {
        console.error("[removePhoto] Фото с таким именем нет: " + photoName)
    } else {
        fs.rmSync(filepath)
    }
}

export function makeActorDirname(body: CreateActorType): string {
    return body.firstName + body.lastName
}

export async function makeActorDirectory(body: CreateActorType): Promise<string> {
    console.log("[makeActorDirectory] start...")
    const dirname: string = crypto.randomUUID()
    const dirPath: string = path.join(returnStaticPath(), dirname)
    
    if (fs.existsSync(dirPath)) {
        throw ApiError.badRequest("[makeActorDirectory] папка с таким именем существует: " + dirPath) // до uuid
    }
    console.log("[makeActorDirectory] directory created: " + dirPath)

    fs.mkdirSync(dirPath)

    console.log("[makeActorDirectory] end. Created directory in /uploads: " + dirPath)
    return dirname
}

export async function removeActorFolder(dirname: string): Promise<void> {
    console.log("[removeActorFolder] start. removing folder...")
    const dirPath: string = path.join(returnStaticPath(), dirname)
    

    if (!fs.existsSync(dirPath)) {
        console.error("[removeActorFolder] нет такой папки: ", dirPath)
    } else {
        try {
            console.log("[removeActorFolder] rmSync(" + dirPath + ")")
            fs.rmSync(dirPath, { recursive: true, force: true })
        } catch (error: any) {
            console.error("[removeActorFolder] " + error)
            throw error
        }
    }
}

export async function saveActorPhotos(photos: CustomFileType, dirname: string): Promise<string[]> {
    console.log("[saveActorPhotos] start...")
    
    const dirPath = path.join(returnStaticPath(), dirname)
    console.log("[saveActorPhotos] path " + dirPath)
    const filenames: string[] = []
    
    if (!Array.isArray(photos)) {
        const uuid: string = crypto.randomUUID()
        await resizeAndSave(photos.data, dirPath, uuid)

        filenames.push(uuid)
    } else {
        if (photos.length > 40) {
            throw ApiError.badRequest("[saveActorPhotos] Загружено более 40 фото")
        }

        for (let i = 0; i < photos.length; i++) {
            const uuid: string = crypto.randomUUID()
            
            console.log("[saveActorPhotos] saving " + i + " photo...")
            await resizeAndSave(photos[i].data, dirPath, uuid)

            filenames.push(uuid)
        }
    }

    console.log("[saveActorPhotos] end")
    return filenames
}

export async function changePhoto(newPhoto: CustomFileType, filename: string, directory?: string,) {
    
    let filepath_400, filepath_1600;

    if (directory) { // if actor, agent doesn't use directory, only raw files.
        filepath_400 = path.join(returnStaticPath(), directory, filename + "_400.jpg")
        filepath_1600 = path.join(returnStaticPath(), directory, filename + "_1600.jpg")
    } else {
        filepath_400 = path.join(returnStaticPath(), filename + "_400.jpg")
        filepath_1600 = path.join(returnStaticPath(), filename + "_1600.jpg")
    }

    if (fs.existsSync(filepath_400)) {
        fs.rmSync(filepath_400)
        throw ApiError.badRequest(`changePhoto: Файл ${filepath_400} не существует`)
    }
    if (fs.existsSync(filepath_1600)) {
        fs.rmSync(filepath_1600)
        throw ApiError.badRequest(`changePhoto: Файл ${filepath_400} не существует`)
    }

    if (Array.isArray(newPhoto)) {
        throw ApiError.badRequest("changePhoto: ожидался одиночный файл")
    }

    const dirPath = path.join(returnStaticPath(), directory)
    await resizeAndSave(newPhoto.data, dirPath, filename)
}