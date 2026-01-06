import { NextFunction, Response, Request } from "express"

import { Actor } from "../../models/actor.entity"
import { appDataSource } from "../../data-source"
import { getActor } from "./getActor"
import { removeActorFolder } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


export async function removeActor(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const { id } = req.params

    if (!id) {
        throw ApiError.badRequest("не найден id")
    }
    const actor = await getActor(id)

    await removeActorFolder(actor.directory)
    await appDataSource.getRepository(Actor).delete({ id: actor.id })
    
    res.status(200).json(true)
} // delete