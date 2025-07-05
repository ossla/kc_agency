import { NextFunction, Request, Response } from "express"

import processApiError from "../error/processError";
import { CreateActorSchema, CreateActorType } from "./types";
import { appDataSource } from "../data-source";
import { Actor } from "../entity/actor.entity";
import { CustomFileType, makeActorDirectory, removeActorFolder } from "./controllerServices/photoService";
import { JwtPayload } from "jsonwebtoken";
import { ICustomRequest } from "../middleware/checkMiddleware";
import { Agent } from "../entity/agent.entity";
import { generateActor } from "./controllerServices/editService";


class actorController {
    static async create(req: ICustomRequest, res: Response, next: NextFunction) : Promise<void> {
        let dirName: string = ""
        try {
            console.log("create actor controller starts...")
            const body: CreateActorType = CreateActorSchema.parse(req.body);

            const photos: CustomFileType = req.files?.photos
            if (!photos) throw new Error('Нужно добавить хотя бы одно фото.')
            dirName = await makeActorDirectory(body)

            const actor: Actor = new Actor()
            actor.directory = dirName

            // await updateActor(actor)

            await generateActor(actor, body)

            // создать функцию изменения, где поля на клиенте будут автоматически заполняться,
            // если актер/агент уже был создан при изменении полей будет посылаться новый запрос 
            // на полное изменение полей у actor/agent так же через zod
            
            await appDataSource.getRepository(Actor).save(actor)
            res.status(200).json(actor)

        } catch (error: unknown) {
            await removeActorFolder(dirName)
            processApiError(404, error, next)
        }
    } // create

    static async delete(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try { // journalId
            

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // delete

    static async getOne(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {

            
        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // getOne

    static async getAll(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {

            
        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // getAll
} // actorController

export default actorController