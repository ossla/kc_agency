import { NextFunction, Request, Response } from "express"

import { getActor } from "../fs_functions/getService"
import processApiError from "../../error/processError"
import { Actor } from "../../entity/actor.entity"
import { appDataSource } from "../../data-source"


export async function getOne(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const { id } = req.params
        const agent = await getActor(id)
        
        res.status(200).json(agent)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
} // getOne

export async function getAll(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const actors: Actor[] = await appDataSource.getRepository(Actor).find()
        res.status(200).json(actors)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
} // getAll