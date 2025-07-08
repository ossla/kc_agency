import { NextFunction, Request, Response } from "express"
import * as bcrypt from "bcrypt"

import processApiError from "../error/processError"
import { CustomFileType, savePhoto, removePhoto, makeAgentPhotoName } from "./services/photoService"
import { createToken } from "./services/securityService"
import { CreateAgentSchema, CreateAgentType, IJwtPayload } from "./types"
import { Agent } from "../entity/agent.entity"
import { appDataSource } from "../data-source"
import { ICustomRequest } from "../middleware/checkMiddleware"
import { getAgent } from "./services/getService"
import { JwtPayload } from "jsonwebtoken"

class agentController {
    static async create(req: ICustomRequest, res: Response, next: NextFunction) 
                                                                : Promise<void> {
        let photoName: string = ""
        try {
            console.log("create agent controller starts...")
            const body: CreateAgentType = CreateAgentSchema.parse(req.body);
            
            const is_exist = await appDataSource.getRepository(Agent)
                                                .findOne({where: {email: body.email}})
            if (is_exist) throw new Error('Пользователь с таким email уже существует')

            const photo: CustomFileType = req.files?.photo
            photoName = makeAgentPhotoName(body)
            await savePhoto(photo, photoName)

            const agent: Agent = new Agent()
            agent.first_name = body.first_name
            agent.last_name = body.last_name
            agent.middle_name = body.middle_name ?? null
            agent.email = body.email
            agent.phone = body.phone 
            agent.description = body.description ?? null
            agent.photo_name = photoName
            agent.telegram = body.telegram ?? null
            agent.VK = body.VK ?? null
            agent.is_admin = true

            agent.hash_password = await bcrypt.hash(body.password, 5)

            await appDataSource.getRepository(Agent).save(agent)

            const token: string = await createToken(agent.id.toString()
                                    , agent.first_name, agent.last_name, agent.is_admin)
            res.status(200).json(token)

        } catch (error: any) {
            if (photoName != "") {
                await removePhoto(photoName)
            }
            processApiError(404, error, next)
        }
    } // create
    
    async login(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            // получение данных
            const { email, password } = req.body
            if (!email || !password) throw new Error('Нужно заполнить все поля')
            // идентификация
            const agent = await appDataSource.getRepository(Agent).findOneBy({
                email: email
            })
            if (!agent) throw new Error('Пользователя с таким email не существует')
            // проверка пароля на валидность
            const valid: boolean = bcrypt.compareSync(password, agent.hash_password)
            if (!valid) throw new Error('Неверный пароль')
            // создание токена
            const token = await createToken(agent.id, agent.first_name, agent.email, true)
            res.json(token)

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    }

    // Метод отвечает за создание нового токена, продление жизни пользователя
    async check(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
        const agent = req.agent as IJwtPayload;
        const agentId = agent.id;
        const agentName = agent.name;
        const agentEmail = agent.email;
        const agentIsAdmin = agent.is_admin;
        const token = await createToken(agentId, agentName, agentEmail, agentIsAdmin)
        res.json(token)
    }

    static async delete(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
        try {
            const { id } = req.body
            const agent = await getAgent(id) // внутри проверит валидность id
            await removePhoto(agent.photo_name)
            await appDataSource.getRepository(Agent).delete({ id: agent.id })

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