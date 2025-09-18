import { Request, Response, NextFunction } from "express"
import * as fs from "fs"

import { appDataSource } from "../../data-source"
import { getAgent } from "./getAgent"
import { Agent } from "../../models/agent.entity"
import processApiError from "../../error/processError"
import { changePhoto, CustomFileType } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


interface IName {
    first?: string,
    last?: string,
    middle?: string
}
function setName(agent: Agent, name: IName) {
    if (name.first) {
        agent.firstName = name.first
    }
    if (name.last) {
        agent.lastName = name.last
    }
    if (name.middle) {
        agent.middleName = name.middle
    }
}

function setAgentStringField<T extends keyof Agent>(agent: Agent, field: T, value: Agent[T] | undefined) {    
    if (value !== undefined) {
        agent[field] = value
    }
}

export async function editAgent(req: Request, res: Response, next: NextFunction) {
    try {    
        const { id } = req.body
        const idNum = Number(id)
        if (!id || !Number.isInteger(idNum)) {
            throw new ApiError(400, "укажите корректный id")
        }
        const {
            firstName,
            lastName,
            middleName,
            email,
            phone,
            description,
            telegram,
            vk,
        } = req.body


        let agent: Agent = await getAgent(Number(id))
        setName(agent, {first: firstName, last: lastName, middle: middleName})
        setAgentStringField(agent, "email", email)
        setAgentStringField(agent, "phone", phone)
        setAgentStringField(agent, "description", description)
        setAgentStringField(agent, "telegram", telegram)
        setAgentStringField(agent, "vk", vk)

        const newAvatar: CustomFileType = req.files?.newAvatar
        if (newAvatar) {
            await changePhoto(newAvatar, agent.photo)
        }

        await appDataSource.getRepository(Agent).save(agent)
        res.json(agent)
    } catch (error: unknown) {
        processApiError(error, next)
    }
}
