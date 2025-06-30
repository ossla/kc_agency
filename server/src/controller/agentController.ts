import { NextFunction, Request, Response } from "express"
import * as bcrypt from "bcrypt"

import processApiError from "../error/processError";
import { CreateAgentSchema, createToken, CustomFileType, savePhoto } from "./services"
import { Agent } from "../entity/agent.entity"
import { DataSource } from "typeorm";
import { appDataSource } from "../data-source";


class agentController {
    static async create(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const body = CreateAgentSchema.parse(req.body);  
            
            const is_exist = await appDataSource.getRepository(Agent).findOne({where: {email: body.email}})
            if (is_exist) throw new Error('Пользователь с таким email уже существует')

            const photo: CustomFileType = req.files?.agentPhoto;
            const photoName: string = (body.firstName + body.lastName + body.middleName).replace(/\s/, '_')
            await savePhoto(photo, photoName);
            
            const agent: Agent = new Agent()
            agent.firstName = body.firstName
            agent.lastName = body.lastName
            agent.middleName = body.middleName
            agent.email = body.email
            agent.phone = body.phone
            agent.description = body.description
            agent.photoName = photoName
            agent.description = body.description ?? agent.description;
            agent.telegram = body.telegram ?? agent.telegram;
            agent.VK = body.VK ?? agent.VK;
            
            agent.hashPassword = await bcrypt.hash(body.password, 5)

            await appDataSource.getRepository(Agent).save(agent)

            const token: string = await createToken(agent.id.toString()
                                    , agent.firstName, agent.lastName, true)
            res.json(token)

        } catch (error: any) {
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
            const request = req.body
            
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
} // agentController

export default agentController