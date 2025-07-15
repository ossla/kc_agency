import { NextFunction, Response, Request } from "express"

import { Actor } from "../../entity/actor.entity"
import { appDataSource } from "../../data-source"
import processApiError from "../../error/processError"
import { getActor } from "../agentController/services/getService"
import { removeActorFolder } from "../fs_functions/fileSystemService"


export async function remove(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const { id } = req.body
        const actor = await getActor(id) // внутри проверит валидность id

        await removeActorFolder(actor.directory)
        await appDataSource.getRepository(Actor).delete({ id: actor.id })
        
        res.status(200).json({message: 'удалён успешно'})

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
} // delete