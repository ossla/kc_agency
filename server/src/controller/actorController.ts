import { NextFunction, Request, Response } from "express"

import processApiError from "../error/processError"
import { CreateActorSchema, CreateActorType } from "./types"
import { appDataSource } from "../data-source"
import { Actor } from "../entity/actor.entity"
import { CustomFileType, makeActorDirectory, removeActorFolder, savePhoto, savePhotos } from "./services/photoService"
import { ICustomRequest } from "../middleware/checkMiddleware"
import { Agent } from "../entity/agent.entity"
import { generateActor } from "./services/editService"
import { getActor } from "./services/getService"


class actorController {
    static async create(req: ICustomRequest, res: Response, next: NextFunction) : Promise<void> {
        let dirName: string = ""
        let otherActorExists: boolean = true
        try {
            console.log("create actor controller starts...")
            const body: CreateActorType = CreateActorSchema.parse(req.body)

            const avatar: CustomFileType = req.files?.avatar
            if (!avatar) throw new Error('Нужно добавить аватарку актера')
            const photos: CustomFileType = req.files?.photos
            if (!photos) throw new Error('Нужно добавить хотя бы одно фото')
            dirName = await makeActorDirectory(body)
            otherActorExists = false
            await savePhoto(avatar, "avatar.jpg", dirName)
            await savePhotos(photos, dirName)

            const actor: Actor = new Actor()
            actor.directory = dirName
            await generateActor(actor, body)

            await appDataSource.getRepository(Actor).save(actor)

            res.status(200).json(actor)

        } catch (error: unknown) {
            if (!otherActorExists) {
                await removeActorFolder(dirName)
            }
            processApiError(404, error, next)
        }
    } // create

    static async delete(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try { // journalId
            const { id } = req.body
            const actor = await getActor(id) // внутри проверит валидность id

            await removeActorFolder(actor.directory)
            await appDataSource.getRepository(Agent).delete({ id: actor.id })
            
            res.status(200).json({message: 'удалён успешно'})

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // delete

    static async getOne(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const { id } = req.params
            const agent = await getActor(id)
            
            res.status(200).json(agent)
            
        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // getOne

    static async getAll(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const actors: Actor[] = await appDataSource.getRepository(Actor).find()
            res.status(200).json(actors)
            
        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // getAll
} // actorController

export default actorController