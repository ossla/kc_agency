import { Request, Response } from "express"

import { appDataSource } from "../../data-source"
import { Actor } from "../../entity/actor.entity"


export async function filter(req: Request, res: Response): Promise<void> {
    const actorRepo = appDataSource.getRepository(Actor)
    const qb = actorRepo.createQueryBuilder("actor")

    qb
      .leftJoinAndSelect("actor.city", "city")
      .leftJoinAndSelect("actor.eye_color", "eye_color")
      .leftJoinAndSelect("actor.agent", "agent")
      .leftJoinAndSelect("actor.languages", "language")

    const {
        agent,
        minAge,
        maxAge,
        cities,
        clothes_size,
        eye_colors,
        gender,
        languages,
        minHeight,
        maxHeight
    } = req.body

    if (agent) {        
        const agentId: number = Number(agent)
        qb.andWhere("actor.agent.id = :agentId", { agentId })
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
        qb.andWhere("language.id IN (:...languageIds)", { languageIds })
    }

    if (gender) {
        qb.andWhere("actor.gender = :gender", { gender })
    }

    if (clothes_size) {
        qb.andWhere("actor.clothes_size = :clothes_size", { clothes_size })
    }

    if (minHeight || maxHeight) {
        if (minHeight && maxHeight) {
            qb.andWhere("actor.height BETWEEN :heightMin AND :heightMax", { heightMin: Number(minHeight), heightMax: Number(maxHeight) })
        } else if (minHeight) {
            qb.andWhere("actor.height >= :heightMin", { heightMin: Number(minHeight) })
        } else if (maxHeight) {
            qb.andWhere("actor.height <= :heightMax", { heightMax: Number(maxHeight) })
        }
    }

    if (minAge || maxAge) {
        const now = new Date()
        const minBirthDate = maxAge ? new Date(now.getFullYear() - Number(maxAge), now.getMonth(), now.getDate()) : null
        const maxBirthDate = minAge ? new Date(now.getFullYear() - Number(minAge), now.getMonth(), now.getDate()) : null

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
          .addGroupBy("city.id")
          .addGroupBy("eye_color.id")
          .addGroupBy("agent.id")
          .addGroupBy("language.id")
    }

    const actors = await qb.getMany()
    res.json(actors)
}