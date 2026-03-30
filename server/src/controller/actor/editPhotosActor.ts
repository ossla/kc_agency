import { NextFunction, Request, Response } from "express"
import { changePhoto, CustomFileType, removePhoto } from "../services/fileSystemService"
import { getActor } from "./getActor"
import { Actor } from "../../models/actor.entity"
import { appDataSource } from "../../data-source"
import ApiError from "../../error/apiError"



export async function changeAvatar(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body 
    if (!id) throw ApiError.badRequest("changeAvatar: не найдено поле id")
    const newAvatar: CustomFileType = req.files?.newAvatar
    if (!newAvatar) throw ApiError.badRequest("changeAvatar: не найдено поле newAvatar")

    const actor: Actor = await getActor(id)

    await changePhoto(newAvatar, "avatar", actor.directory)
    res.status(200).json(true)
}

export async function changeOrder(req: Request, res: Response, next: NextFunction) {    
    res.json("покап не реализовано")
}

export async function deletePhoto(req: Request, res: Response, next: NextFunction) {
    const { id, photoIdx } = req.body
    if (!id || photoIdx === undefined) {
        throw ApiError.badRequest("deletePhoto: не указано поле employeeId или photoIdx")
    }
    const actor: Actor = await getActor(id)
    const index: number = Number(photoIdx)
    if (index >= actor.photos.length || index < 0) {
        throw ApiError.badRequest(`changeOrder: неверная позиция. photoIdx = ${index}, последний индекс = ${actor.photos.length - 1}`)
    }

    await removePhoto(actor.photos[index], actor.directory)

    actor.photos.splice(index, 1)

    await appDataSource.getRepository(Actor).save(actor)
    res.status(200).json(true)
}