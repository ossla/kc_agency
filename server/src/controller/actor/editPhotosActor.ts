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

// при запросе change order нужно поменять порядок фото в поле actor.photos 
// порядок задается индексами в массиве, элементы массива string -- наименования файлов
// {"1.jpg", "5.jpg", "3.jpg"}
export async function changeOrder(req: Request, res: Response, next: NextFunction) {    
    const {currIdx, putAfterIdx, id} = req.body
    if (currIdx === undefined || putAfterIdx === undefined) {
        throw ApiError.badRequest("changeOrder: не найдено поле currPos или putAfterIdx")
    }
    if (!id) {
        throw ApiError.badRequest("changeOrder: не найдено поле id")
    }

    let actor: Actor = await getActor(id)
    if (!actor.photos || actor.photos.length <= 0) {
        throw ApiError.badRequest("changeOrder: у актера нет фото")
    }

    const curr: number = Number(currIdx)
    const after: number = Number(putAfterIdx)
    const arrLength: number = actor.photos.length
    if (arrLength === 1) {
        return;
    }
    if (curr >= arrLength || after >= arrLength || curr < 0 || after < -1) { // after может быть -1, чтобы переставить объект на 0
        throw ApiError.badRequest(`changeOrder: неверная позиция. currIdx = ${curr}, putAfterIdx = ${after}, последний индекс = ${arrLength - 1}`)
    }
    const currEl: string = actor.photos[curr]
    if (curr < after) {
        for (let i = curr + 1; i <= after; ++i) {
            actor.photos[i-1] = actor.photos[i]
        }
        actor.photos[after] = currEl
    } else {
        for (let i = curr - 1; i > after; --i) {
            actor.photos[i+1] = actor.photos[i]
        }
        actor.photos[after + 1] = currEl
    }

    await appDataSource.getRepository(Actor).save(actor)
    res.json(actor)
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