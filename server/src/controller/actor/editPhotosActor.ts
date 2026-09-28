import { NextFunction, Request, Response } from "express"
import { changePhoto, CustomFileType, removePhoto, saveActorPhotos } from "../services/fileSystemService"
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

export async function deletePhoto(req: Request, res: Response, next: NextFunction) {
    const { id, photoId } = req.body
    if (!id || !photoId) {
        throw ApiError.badRequest("deletePhoto: не найдено поле id или photoId")
    }

    let directory = ""
    await appDataSource.transaction(async manager => {
        const actor = await manager.createQueryBuilder(Actor, "actor").setLock("pessimistic_write")
            .where("actor.id = :id", { id }).getOne()
        if (!actor || !actor.photos.includes(photoId)) throw ApiError.badRequest("Фото не найдено. Обновите страницу")
        directory = actor.directory
        await manager.update(Actor, actor.id, { photos: actor.photos.filter(photo => photo !== photoId) })
    })
    // Never delete the files before their removal from the database is committed.
    await removePhoto(photoId, directory).catch(error => console.error("Photo cleanup failed", error))
    res.status(200).json(true)
}

export async function addPhoto(req: Request, res: Response, next: NextFunction) { 
    const { id } = req.body
    if (!id) throw ApiError.badRequest("addPhoto: не найдено поле id")

    const photos: CustomFileType = req.files?.photos
    if (!photos) throw ApiError.badRequest('Нужно добавить хотя бы одно фото')

    let directory = ""
    let newPhotos: string[] = []
    try {
        await appDataSource.transaction(async manager => {
            const actor = await manager.createQueryBuilder(Actor, "actor").setLock("pessimistic_write")
                .where("actor.id = :id", { id }).getOne()
            if (!actor) throw ApiError.badRequest("Актёр не найден")
            directory = actor.directory
            newPhotos = await saveActorPhotos(photos, directory)
            await manager.update(Actor, actor.id, { photos: actor.photos.concat(newPhotos) })
        })
    } catch (error) {
        await Promise.all(newPhotos.map(photo => removePhoto(photo, directory).catch(console.error)))
        throw error
    }
    res.status(200).json(await getActor(id))
}

export async function changeOrder(req: Request, res: Response, next: NextFunction) {
    const { id, photos } = req.body

    if (!id || !Array.isArray(photos)) {
        throw ApiError.badRequest("changeOrder: не найдено поле id или photos")
    }

    await appDataSource.transaction(async manager => {
        const actor = await manager.createQueryBuilder(Actor, "actor").setLock("pessimistic_write")
            .where("actor.id = :id", { id }).getOne()
        if (!actor) throw ApiError.badRequest("Актёр не найден")

        const oldSet = new Set(actor.photos)
        const newSet = new Set(photos)
        if (photos.length !== actor.photos.length || newSet.size !== photos.length || oldSet.size !== newSet.size || ![...oldSet].every(p => newSet.has(p))) {
            throw ApiError.badRequest("changeOrder: массив фото не совпадает с текущим")
        }
        await manager.update(Actor, actor.id, { photos })
    })

    res.status(200).json(true)
}
