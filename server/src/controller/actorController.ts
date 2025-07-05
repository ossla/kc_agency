import { NextFunction, Request, Response } from "express"

import processApiError from "../error/processError";
import { CreateActorSchema, CreateActorType } from "./types";
import { appDataSource } from "../data-source";
import { Actor } from "../entity/actor.entity";
import { CustomFileType, makeActorFolderName } from "./controllerServices/photoService";
import { JwtPayload } from "jsonwebtoken";
import { ICustomRequest } from "../middleware/checkMiddleware";
import { Agent } from "../entity/agent.entity";


class actorController {
    static async create(req: ICustomRequest, res: Response, next: NextFunction) : Promise<void> {
        try {
            console.log("create actor controller starts...")
            const body: CreateActorType = CreateActorSchema.parse(req.body);

            const photos: CustomFileType = req.files?.photos
            if (!photos) throw new Error('Нужно добавить хотя бы одно фото.')
            const folderName: string = await makeActorFolder(body)

            const actor: Actor = new Actor()
            actor.first_name = body.first_name
            actor.last_name  = body.last_name
            actor.middle_name = body.middle_name
            // actor.date_of_birth = body.date_of_birth.getDate()
            actor.height = body.height
            actor.clothes_size = body.clothes_size
            actor.description = body.description ?? actor.description
            actor.folder = folderName
            actor.link_to_kino_teatr = body.kino_teatr
            actor.link_to_film_tools = body.film_tools
            actor.link_to_kinopoisk = body.kinopoisk
            actor.video = body.video
            actor.creator = (req as JwtPayload).user.name || "admin"
            const agent: Agent = await appDataSource.getRepository(Agent)
                                                    .findOne({where: {id: body.agent}})
            if (!agent) {
                throw new Error("Такого агента нет!")
            }

            // создать функцию изменения, где поля на клиенте будут автоматически заполняться,
            // если актер/агент уже был создан при изменении полей будет посылаться новый запрос на полное изменение
            // полей у actor/agent так же через zod
            
            await appDataSource.getRepository(actor).save(actor)

            const token: string = await createToken(agent.id.toString()
                                    , agent.first_name, agent.last_name, true)
            res.status(200).json(token)

        } catch (error: unknown) {
            await removeActorFolder()
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