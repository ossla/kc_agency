import fileUpload from "express-fileupload"
import * as path from "path"
import * as fs from "fs"
import { CreateAgentType } from "../agentController/services/types"
import { CreateActorType } from "../actorController/services/types"


function returnStaticPath(): string {
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
    }
    console.log(filePath);
    fs.rmSync(filePath)
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

export async function savePhotos(photos: CustomFileType, dirname: string) {
    const dirPath: string = path.join(returnStaticPath(), dirname)
                                                                
    if (!Array.isArray(photos)) {
        photos.mv(path.join(dirPath, '1.jpg'))
    } else {
        photos.forEach((page, index) => {
            page.mv(path.join(dirPath, `${index + 1}.jpg`))
        })
    }
}