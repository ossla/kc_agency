import { Request, Response } from "express"

import { appDataSource } from "../../data-source"
import { Actor } from "../../entity/actor.entity"


export async function filter(req: Request, res: Response): Promise<void> {
    const actorRepo = appDataSource.getRepository(Actor)
    const qb = actorRepo.createQueryBuilder("actor")

    qb
      .leftJoinAndSelect("actor.city", "city")
      .leftJoinAndSelect("actor.eye_color", "eye_color")
      .leftJoinAndSelect("actor.languages", "languages")

    const {
        agent,
        ageBottom,
        ageTop,
        cities,
        clothes_size,
        eye_colors,
        gender,
        languages,
        height,
    } = req.query

    if (agent) {
        const agentId: number = Number(agent)
        qb.andWhere("actor.agentId == :agentId", { agentId })
    }

    if (cities) {
        const cityIds: Array<Number> = (Array.isArray(cities) ? cities : (cities as string).split(",")).map(Number)
        qb.andWhere("actor.city_id IN (:...cityIds)", { cityIds })
    }

    if (eye_colors) {
        const eyeColorIds = (Array.isArray(eye_colors) ? eye_colors : (eye_colors as string).split(",")).map(Number)
        qb.andWhere("actor.eye_color_id IN (:...eyeColorIds)", { eyeColorIds })
    }

    if (languages) {
        const languageIds = (Array.isArray(languages) ? languages : (languages as string).split(",")).map(Number)
        qb.leftJoin("actor.languages", "language")
        qb.andWhere("language.id IN (:...languageIds)", { languageIds })
    }

    if (gender) {
        qb.andWhere("actor.gender = :gender", { gender })
    }

    if (clothes_size) {
        qb.andWhere("actor.clothes_size = :clothes_size", { clothes_size })
    }

    if (height) {
        qb.andWhere("actor.height = :height", { height: Number(height) })
    }

    if (ageBottom || ageTop) {
        const now = new Date()
        const minBirthDate = ageTop ? new Date(now.getFullYear() - Number(ageTop), now.getMonth(), now.getDate()) : null
        const maxBirthDate = ageBottom ? new Date(now.getFullYear() - Number(ageBottom), now.getMonth(), now.getDate()) : null

        if (minBirthDate && maxBirthDate) {
        qb.andWhere("actor.date_of_birth BETWEEN :minBirth AND :maxBirth", {
            minBirth: minBirthDate.toISOString().split('T')[0],
            maxBirth: maxBirthDate.toISOString().split('T')[0],
        })
        } else if (minBirthDate) {
        qb.andWhere("actor.date_of_birth >= :minBirth", { minBirth: minBirthDate.toISOString().split('T')[0] })
        } else if (maxBirthDate) {
        qb.andWhere("actor.date_of_birth <= :maxBirth", { maxBirth: maxBirthDate.toISOString().split('T')[0] })
        }
    }

    if (languages) {
        qb.groupBy("actor.id")
    }

    const actors = await qb.getMany()
    res.json(actors)
}