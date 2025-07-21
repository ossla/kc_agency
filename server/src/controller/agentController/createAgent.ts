import { NextFunction, Request, Response } from "express"
import * as bcrypt from "bcrypt"

import { ICustomRequest } from "../../middleware/checkMiddleware"
import { createAgentSchema, CreateAgentType } from "../services/types"
import { appDataSource } from "../../data-source"
import { Agent } from "../../entity/agent.entity"
import processApiError from "../../error/processError"
import { CustomFileType, /** makeAgentPhotoName,*/ removePhoto, savePhoto } from "../services/fileSystemService"
import { createToken } from "./loginAgent"


export async function create(req: ICustomRequest, res: Response, next: NextFunction) {
    let photoName: string = ""
    try {
        console.log("create agent controller starts...")
        const body: CreateAgentType = createAgentSchema.parse(req.body)

        const is_exist = await appDataSource.getRepository(Agent)
                                            .findOne({where: {email: body.email}})
        if (is_exist) throw new Error('Пользователь с таким email уже существует')

        const photo: CustomFileType = req.files?.photo
        photoName = crypto.randomUUID()
        await savePhoto(photo, crypto.randomUUID())

        const agent: Agent = new Agent()
        agent.firstName = body.firstName
        agent.lastName = body.lastName
        agent.middleName = body.middleName ?? null
        agent.email = body.email
        agent.phone = body.phone
        agent.description = body.description ?? null
        agent.photo = photoName
        agent.telegram = body.telegram ?? null
        agent.vk = body.vk ?? null
        agent.isAdmin = true

        agent.hashPassword = await bcrypt.hash(body.password, 5)

        await appDataSource.getRepository(Agent).save(agent)

        const token: string = await createToken(
            agent.id,
            agent.firstName,
            agent.lastName,
            agent.isAdmin
        )

        res.json(token)

    } catch (error: any) {
        if (photoName != "") {
            await removePhoto(photoName)
        }
        processApiError(404, error, next)
    }
} // create
