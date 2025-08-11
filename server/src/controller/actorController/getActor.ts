import { NextFunction, Request, Response } from "express"

import processApiError from "../../error/processError"
import { Actor } from "../../entity/actor.entity"
import { appDataSource } from "../../data-source"
import { GenderEnum } from "../services/actorTypes"


export async function getActor(id: number): Promise<Actor> {
    const actor: Actor | null = await appDataSource
                                            .getRepository(Actor)
                                            .findOne({where: { id }})
    if (!actor) {
        throw new Error("актера с таким id нет")
    }

    return actor
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const agent = await getActor(Number(id))
        
        res.status(200).json(agent)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

// для тестов
export async function getAllFull(req: Request, res: Response, next: NextFunction) {
    try {
        const actors: Actor[] = await appDataSource.getRepository(Actor).find()
        res.status(200).json(actors)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function getShort(req: Request, res: Response, next: NextFunction) {
    try {
        const actors = await appDataSource.getRepository(Actor)
            .createQueryBuilder("actor")
            .select(["actor.id", "actor.firstName", "actor.lastName", "actor.directory"])
            .orderBy("LOWER(actor.lastName)", "ASC")
            .getMany()

        res.json(actors);

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

async function getShortByGender(res: Response, gender: GenderEnum, next: NextFunction) {
    try {
        const actors = await appDataSource.getRepository(Actor)
            .createQueryBuilder("actor")
            .select(["actor.id", "actor.firstName", "actor.lastName", "actor.directory"])
            .where("actor.gender = :gender", { gender })
            .getMany()

        res.json(actors);

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function getShortMen(req: Request, res: Response, next: NextFunction) {
    getShortByGender(res, GenderEnum.Man, next)
}

export async function getShortWomen(req: Request, res: Response, next: NextFunction) {
    getShortByGender(res, GenderEnum.Woman, next)
}
