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

    const actor: Actor = await getActor(id)
    const index = actor.photos.indexOf(photoId)

    if (index === -1) {
        throw ApiError.badRequest("photo not found")
    }

    await removePhoto(photoId, actor.directory)

    actor.photos.splice(index, 1)

    await appDataSource.getRepository(Actor).save(actor)
    res.status(200).json(true)
}

export async function addPhoto(req: Request, res: Response, next: NextFunction) { 
    console.log("[addPhoto] starts.");
    const { id } = req.body
    if (!id) throw ApiError.badRequest("addPhoto: не найдено поле id")

    const photos: CustomFileType = req.files?.photos
    if (!photos) throw ApiError.badRequest('Нужно добавить хотя бы одно фото')

    const actor: Actor = await getActor(id)
    const newPhotos: string[] = await saveActorPhotos(photos, actor.directory)
    console.log("[addPhoto] old photos: " + actor.photos)
    console.log("[addPhoto] new photos: " + newPhotos)
    actor.photos = actor.photos.concat(newPhotos)

    console.log("[addPhoto] new concated photos: " + actor.photos)

    await appDataSource.getRepository(Actor).save(actor)
    console.log("[addPhoto] actor saved")

    console.log("[addPhoto] ends. no errors occured");

    res.status(200).json(actor)
}

export async function changeOrder(req: Request, res: Response, next: NextFunction) {
    const { id, photos } = req.body

    if (!id || !Array.isArray(photos)) {
        throw ApiError.badRequest("changeOrder: не найдено поле id или photos")
    }

    const actor: Actor = await getActor(id)

    // проверка на те же фото, что и были
    const oldSet = new Set(actor.photos)
    const newSet = new Set(photos)
    if (oldSet.size !== newSet.size || ![...oldSet].every(p => newSet.has(p))) {
        throw ApiError.badRequest("changeOrder: массив фото не совпадает с текущим")
    }

    actor.photos = photos

    await appDataSource.getRepository(Actor).save(actor)

    res.status(200).json(true)
}