import { NextFunction, Request, Response } from "express"
import * as bcrypt from "bcrypt"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { createAgentSchema, CreateAgentType } from "./agentTypes"
import { appDataSource } from "../../data-source"
import { Agent } from "../../models/agent.entity"
import processApiError from "../../error/processError"
import { CustomFileType, /** makeAgentPhotoName,*/ removePhoto, savePhoto } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


export async function createAgent(req: ICustomRequest, res: Response, next: NextFunction) {
    let photoName: string = ""
    try {
        console.log("create agent controller starts...")
        const body: CreateAgentType = createAgentSchema.parse(req.body)

        const is_exist = await appDataSource.getRepository(Agent)
                                            .findOne({where: {email: body.email}})
        if (is_exist) throw new Error('Пользователь с таким email уже существует')

        const photo: CustomFileType = req.files?.photo
        if (!photo) {
            throw new ApiError(400, "Необходимо добавить поле photo для загрузки аватара")
        }
        photoName = crypto.randomUUID()
        await savePhoto(photo, crypto.randomUUID() + ".jpg")

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

        await appDataSource.getRepository(Agent).save(agent)
        res.status(201).json(agent)

    } catch (error: any) {
        if (photoName != "") {
            await removePhoto(photoName)
        }
        processApiError(error, next)
    }
} // create
