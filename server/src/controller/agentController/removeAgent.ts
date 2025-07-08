import { NextFunction, Response, Request } from "express"

import { getAgent } from "../fs_functions/getService"
import { appDataSource } from "../../data-source"
import { Agent } from "../../entity/agent.entity"
import processApiError from "../../error/processError"
import { removePhoto } from "../fs_functions/fileSystemService"


export async function remove(req: Request, res: Response, next: NextFunction) 
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
