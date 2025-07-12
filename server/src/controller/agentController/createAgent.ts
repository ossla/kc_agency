import { NextFunction, Request, Response } from "express"
import * as bcrypt from "bcrypt"

import { ICustomRequest } from "../../middleware/checkMiddleware";
import { CreateAgentSchema, CreateAgentType } from "./services/types";
import { appDataSource } from "../../data-source";
import { Agent } from "../../entity/agent.entity";
import processApiError from "../../error/processError";
import { CustomFileType, makeAgentPhotoName, removePhoto, savePhoto } from "../fs_functions/fileSystemService";
import { createToken } from "./loginAgent";


export async function create(req: ICustomRequest, res: Response, next: NextFunction) 
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
