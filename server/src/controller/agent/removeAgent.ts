import { NextFunction, Response, Request } from "express"

import { getAgent } from "./getAgent"
import { appDataSource } from "../../data-source"
import { Agent } from "../../models/agent.entity"
import processApiError from "../../error/processError"
import { removePhoto } from "../services/fileSystemService"


export async function remove(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.body
        const agent = await getAgent(id) // внутри проверит валидность id
        await removePhoto(agent.photo)
        await appDataSource.getRepository(Agent).delete({ id: agent.id })

        res.status(200).json(true)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
} // delete
