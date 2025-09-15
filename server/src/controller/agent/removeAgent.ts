import { NextFunction, Response, Request } from "express"

import { getAgent } from "./getAgent"
import { appDataSource } from "../../data-source"
import { Agent } from "../../models/agent.entity"
import processApiError from "../../error/processError"
import { removePhoto } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


export async function removeAgent(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.params
        const idNum = Number(id)
        if (!id || !Number.isInteger(idNum)) {
            throw new ApiError(400, "укажите корректный id")
        }
        const agent = await getAgent(Number(id))
        await removePhoto(agent.photo)
        await appDataSource.getRepository(Agent).delete({ id: agent.id })

        res.status(200).json(true)

    } catch (error: unknown) {
        processApiError(error, next)
    }
} // delete
