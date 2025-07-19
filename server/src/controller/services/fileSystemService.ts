import fileUpload from "express-fileupload"
import * as path from "path"
import * as fs from "fs"
import { CreateAgentType } from "./types"
import { CreateActorType } from "./types"


// код для работы с файлами на сервере

export function returnStaticPath(): string {
    const pathToStatic: string = path.join(__dirname, "..", "..", "..", "static")
    if (!fs.existsSync(pathToStatic)) {
        fs.mkdirSync(pathToStatic)
    }
    return pathToStatic;
}

export type CustomFileType = fileUpload.UploadedFile 
                            | fileUpload.UploadedFile[]
                            | undefined
                      
export async function savePhoto(photo: CustomFileType
                    , photoName: string, folderName: string = "") {
    folderName = path.join(returnStaticPath(), folderName)

    const filePath: string = path.join(folderName, photoName);
    if (fs.existsSync(filePath)) {
        throw new Error("Фото с таким именем уже существует: " + photoName);
    }
    if (photo) {
        if (Array.isArray(photo)) {
            throw new Error("загрузите только 1 файл")
        }
        photo.mv(filePath)
    } else {
        throw new Error("загрузите фото")
    }
}

export async function removePhoto(photoName: string, folderName: string = "")
                                                            : Promise<void> {
    if (folderName === "") { folderName = returnStaticPath(); }
    console.log(photoName);

    const filePath: string = path.join(folderName, photoName);
    if (!fs.existsSync(filePath)) {
        console.error("Фото с таким именем нет: " + photoName);
    } else {
        fs.rmSync(filePath)
    }
}

export function makeAgentPhotoName(body: CreateAgentType): string {
    return  (body.first_name 
            + 
            body.last_name
            + 
            body.middle_name
            +
            ".jpg").replace(/\s/, '_')
}

export function makeActorDirname(body: CreateActorType): string {
    return body.first_name + body.last_name
}

export async function makeActorDirectory(body: CreateActorType): Promise<string> {
    const dirname: string = makeActorDirname(body)
    const dirPath: string = path.join(returnStaticPath(), dirname)
    
    if (fs.existsSync(dirPath)) {
        throw new Error("папка с таким именем существует: " + dirPath)
    }

    fs.mkdirSync(dirPath)

    return dirname
}

export async function removeActorFolder(dirname: string): Promise<void> {
    const dirPath: string = path.join(returnStaticPath(), dirname)
    if (!fs.existsSync(dirPath)) {
        console.error("нет такой папки: ", dirPath);
    } else {
        try {
            fs.rmSync(dirPath, { recursive: true, force: true })
        } catch (error: any) {
            console.error(error);
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
        if (photos.length > 20) {
            throw new Error("saveActorPhotos: Загружено более 20 фото")
        }

        for (let i = 0; i < photos.length; i++) {
            const filename = `${i + 1}.jpg`
            await photos[i].mv(path.join(dirPath, filename))
            filenames.push(filename)
        }
    }
    return filenames
}
