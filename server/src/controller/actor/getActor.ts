import { NextFunction, Request, Response } from "express"

import { Actor } from "../../models/actor.entity"
import { appDataSource } from "../../data-source"
import { GenderEnum } from "./actorTypes"
import ApiError from "../../error/apiError"


export async function getActor(id: string): Promise<Actor> {
    const actor: Actor | null = await appDataSource
                                            .getRepository(Actor)
                                            .findOne({where: { id }})
    if (!actor) {
        throw ApiError.badRequest("актера с таким id нет")
    }

    return actor
}

export async function getOneActor(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    if (!id) {
        throw ApiError.badRequest("не найден id")
    }
    const employee = await getActor(id)
    
    res.status(200).json(employee)
}

export async function getAllFullActors(req: Request, res: Response, next: NextFunction) {
    const actors: Actor[] = await appDataSource.getRepository(Actor).find()
    res.status(200).json(actors)
}

export async function getShortActors(req: Request, res: Response, next: NextFunction) {
    const actors = await appDataSource.getRepository(Actor)
        .createQueryBuilder("actor")
        .select(["actor.id", "actor.firstName", "actor.lastName", "actor.directory", "actor.videoURL"])
        .orderBy("LOWER(actor.lastName)", "ASC")
        .getMany()

    res.json(actors);
}

async function getShortByGender(res: Response, gender: GenderEnum, next: NextFunction) {
    const actors = await appDataSource.getRepository(Actor)
        .createQueryBuilder("actor")
        .select(["actor.id", "actor.firstName", "actor.lastName", "actor.directory", "actor.videoURL"])
        .where("actor.gender = :gender", { gender })
        .getMany()

    res.json(actors);
}

export async function getShortMenActors(req: Request, res: Response, next: NextFunction) {
    getShortByGender(res, GenderEnum.Man, next)
}

export async function getShortWomenActors(req: Request, res: Response, next: NextFunction) {
    getShortByGender(res, GenderEnum.Woman, next)
}
