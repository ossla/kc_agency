import { NextFunction, Request, Response } from "express"

import processApiError from "../../error/processError"
import { Actor } from "../../entity/actor.entity"
import { appDataSource } from "../../data-source"


export async function getActor(id: number): Promise<Actor> {
    const actor: Actor | null = await appDataSource
                                            .getRepository(Actor)
                                            .findOne({where: { id }})
    if (!actor) {
        throw new Error("актера с таким id нет")
    }

    return actor
}

export async function getOne(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const { id } = req.params
        const agent = await getActor(Number(id))
        
        res.status(200).json(agent)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function getAllFull(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const actors: Actor[] = await appDataSource.getRepository(Actor).find()
        res.status(200).json(actors)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function getAllShort(req: Request, res: Response) {
    const actors = await appDataSource.getRepository(Actor)
        .createQueryBuilder("actor")
        .select(["actor.id", "actor.first_name", "actor.last_name", "actor.directory"])
        .getMany();

    res.json(actors);
}