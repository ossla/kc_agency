import { NextFunction, Request, Response } from "express"
import * as bcrypt from "bcrypt"

import processApiError from "../error/processError"
import { CustomFileType, savePhoto, removePhoto, makeAgentPhotoName } from "./controllerServices/photoService"
import { createToken } from "./controllerServices/securityService"
import { CreateAgentSchema, CreateAgentType } from "./types"
import { Agent } from "../entity/agent.entity"
import { appDataSource } from "../data-source"
import { ICustomRequest } from "../middleware/checkMiddleware"
import { getAgent } from "./controllerServices/detail"


class agentController {
    static async create(req: ICustomRequest, res: Response, next: NextFunction) 
                                                                : Promise<void> {
        try {
            // const creator: string = (req.user as JwtPayload).name

            console.log("create agent controller starts...")
            const body: CreateAgentType = CreateAgentSchema.parse(req.body);
            
            const is_exist = await appDataSource.getRepository(Agent)
                                                .findOne({where: {email: body.email}})
            if (is_exist) throw new Error('Пользователь с таким email уже существует')

            const photo: CustomFileType = req.files?.photo
            const photoName: string = makeAgentPhotoName(body)
            await savePhoto(photo, photoName)

            const agent: Agent = new Agent()
            agent.firstName = body.firstName
            agent.lastName = body.lastName
            agent.middleName = body.middleName
            agent.email = body.email
            agent.phone = body.phone
            agent.description = body.description
            agent.photoName = photoName
            agent.description = body.description ?? agent.description
            agent.telegram = body.telegram ?? agent.telegram
            agent.VK = body.VK ?? agent.VK
            agent.creator = "admin" // creator
            
            agent.hashPassword = await bcrypt.hash(body.password, 5)

            await appDataSource.getRepository(Agent).save(agent)

            const token: string = await createToken(agent.id.toString()
                                    , agent.firstName, agent.lastName, true)
            res.status(200).json(token)

        } catch (error: any) {
            processApiError(404, error, next)
        }
    } // create

    static async delete(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
        try {
            const { id } = req.body
            const agent = await getAgent(id) // внутри проверит валидность id
            await appDataSource.getRepository(Agent).delete({ id: agent.id })

            removePhoto(agent.photoName)

            res.status(200).json({message: 'удалён успешно'})

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // delete

    static async getOne(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
        try {
            const { id } = req.params
            const agent = await getAgent(id)
            
            res.status(200).json(agent)
            
        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // getOne

    static async getAll(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
        try {
            const agents: Agent[] = await appDataSource.getRepository(Agent).find()
            res.status(200).json(agents)
            
        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // getAll
} // agentController

export default agentController