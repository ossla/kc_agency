import fileUpload from "express-fileupload"
import * as path from "path"
import * as fs from "fs"
import { z } from "zod"
import jwt from 'jsonwebtoken';
import { Agent } from "../entity/agent.entity";

export const CreateAgentSchema = z.object({
    firstName: z.string().min(1, "введите Имя"),
    lastName: z.string().min(1, "введите фамилию"),
    middleName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(1, "введите пароль"),
    phone: z.string().min(1, "введите номер телефона"),
    description: z.string().optional(),
    telegram: z.string().optional(),
    VK: z.string().optional()
});

export type CreateAgentType = z.infer<typeof CreateAgentSchema>;

function returnStaticPath(): string {
    const pathToStatic: string = path.join(__dirname, "..", "..", "static")
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
    photoName += ".jpeg";
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


export async function createToken(id: string, name: string, email: string, is_admin: boolean): Promise<string> {
    const secretKey = process.env.SECRETKEY as string | undefined;
    if (!secretKey) {
        throw new Error('Secret key is not defined');
    }
    return jwt.sign(
        {
            id,
            name,
            email,
            is_admin
        },
        secretKey,
        {expiresIn: '1 days'}
    )
}