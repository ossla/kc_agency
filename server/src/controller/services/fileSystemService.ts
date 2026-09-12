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
    let dirPath: string;
    if (dirName === "") {
        dirPath = returnStaticPath()
    } else {
        dirPath = path.join(returnStaticPath(), dirName)
    }
    console.log("[removePhoto] dirname: " + dirName)

    const filepath1 = path.join(dirPath, photoName + "_400.jpg");
    const filepath2 = path.join(dirPath, photoName + "_1600.jpg");
    console.log("[removePhoto] check exist:", filepath1, " and ", filepath2)

    if (!fs.existsSync(filepath1) || !fs.existsSync(filepath2)) {
        console.error("[removePhoto] Фото с таким именем нет: " + photoName);
        throw new ApiError(401, "removePhoto: photo not found");
    } else {
        fs.rmSync(filepath1)
        fs.rmSync(filepath2)
    }
    console.log("[removePhoto] ends. photo removed.")
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
        if (photos.length > 20) {
            throw ApiError.badRequest("[saveActorPhotos] Загружено более 20 фото")
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

// export async function changePhoto(newPhoto: CustomFileType, filename: string, directory?: string,) {
    
//     let filepath_400, filepath_1600;

//     if (directory) { // if actor, agent doesn't use directory, only raw files.
//         filepath_400 = path.join(returnStaticPath(), directory, filename + "_400.jpg")
//         filepath_1600 = path.join(returnStaticPath(), directory, filename + "_1600.jpg")
//     } else {
//         filepath_400 = path.join(returnStaticPath(), filename + "_400.jpg")
//         filepath_1600 = path.join(returnStaticPath(), filename + "_1600.jpg")
//     }

//     if (fs.existsSync(filepath_400)) {
//         fs.rmSync(filepath_400)
//         throw ApiError.badRequest(`changePhoto: Файл ${filepath_400} не существует`)
//     }
//     if (fs.existsSync(filepath_1600)) {
//         fs.rmSync(filepath_1600)
//         throw ApiError.badRequest(`changePhoto: Файл ${filepath_400} не существует`)
//     }

//     if (Array.isArray(newPhoto)) {
//         throw ApiError.badRequest("changePhoto: ожидался одиночный файл")
//     }

//     const dirPath = path.join(returnStaticPath(), directory)
//     await resizeAndSave(newPhoto.data, dirPath, filename)
// }

export async function changePhoto(newPhoto: CustomFileType, filename: string, directory?: string) {
    if (Array.isArray(newPhoto)) {
        throw ApiError.badRequest("changePhoto: ожидался одиночный файл");
    }

    const baseDir = directory ?? "";
    const dirPath = path.join(returnStaticPath(), baseDir);

    const filepath_400 = path.join(dirPath, `${filename}_400.jpg`);
    const filepath_1600 = path.join(dirPath, `${filename}_1600.jpg`);

    const backup_400 = filepath_400 + ".bak";
    const backup_1600 = filepath_1600 + ".bak";

    try {
        if (fs.existsSync(filepath_400)) fs.renameSync(filepath_400, backup_400);
        if (fs.existsSync(filepath_1600)) fs.renameSync(filepath_1600, backup_1600);
    } catch (err) {
        console.error("changePhoto: failed to move existing files to backup", err);
    }

    try {
        await resizeAndSave(newPhoto.data, dirPath, filename);

        try { if (fs.existsSync(backup_400)) fs.rmSync(backup_400); } catch(e){ console.warn("changePhoto: couldn't remove backup_400", e) }
        try { if (fs.existsSync(backup_1600)) fs.rmSync(backup_1600); } catch(e){ console.warn("changePhoto: couldn't remove backup_1600", e) }

    } catch (err) {
        try {
            if (fs.existsSync(backup_400)) {
                if (fs.existsSync(filepath_400)) fs.rmSync(filepath_400);
                fs.renameSync(backup_400, filepath_400);
            }
            if (fs.existsSync(backup_1600)) {
                if (fs.existsSync(filepath_1600)) fs.rmSync(filepath_1600);
                fs.renameSync(backup_1600, filepath_1600);
            }
        } catch (restoreErr) {
            console.error("changePhoto: failed to restore backups after error", restoreErr);
        }

        if (err instanceof ApiError) throw err;
        throw ApiError.internal("changePhoto: ошибка при сохранении фото");
    }
}