import fileUpload from "express-fileupload"
import * as path from "path"
import * as fs from "fs"

import { CreateAgentType } from "../types";


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
    if (folderName === "") { folderName = returnStaticPath(); }
    console.log(photoName);

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

export async function removePhoto(photoName: string, folderName: string = "") {
    if (folderName === "") { folderName = returnStaticPath(); }
    console.log(photoName);

    const filePath: string = path.join(folderName, photoName);
    if (!fs.existsSync(filePath)) {
        throw new Error("Фото с таким именем нет: " + photoName);
    }
    fs.rmSync(filePath)
}

export function makeAgentPhotoName(body: CreateAgentType): string {
    return  (body.firstName 
            + 
            body.lastName
            + 
            body.middleName
            +
            ".jpeg").replace(/\s/, '_')
}
