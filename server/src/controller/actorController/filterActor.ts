import { Request, Response } from "express"

import { appDataSource } from "../../data-source"
import { Actor } from "../../entity/actor.entity"
import { SelectQueryBuilder } from "typeorm"


function filterByAgent(qb: SelectQueryBuilder<Actor>, agent: any) {
    if (agent) {
        qb.andWhere("actor.agent.id = :agentId", { agentId: Number(agent) })
    }
}

function filterByCities(qb: SelectQueryBuilder<Actor>, cities: any) {
    if (cities) {
        const cityIds = (Array.isArray(cities) ? cities : (cities as string).split(",")).map(Number)
        qb.andWhere("actor.city_id IN (:...cityIds)", { cityIds })
    }
}

function filterByEyeColors(qb: SelectQueryBuilder<Actor>, eye_colors: any) {
    if (eye_colors) {
        const eyeColorIds = (Array.isArray(eye_colors) ? eye_colors : (eye_colors as string).split(",")).map(Number)
        qb.andWhere("actor.eye_color_id IN (:...eyeColorIds)", { eyeColorIds })
    }
}

function filterByLanguages(qb: SelectQueryBuilder<Actor>, languages: any) {
    if (languages) {
        const languageIds = (Array.isArray(languages) ? languages : (languages as string).split(",")).map(Number)
        qb.andWhere("language.id IN (:...languageIds)", { languageIds })
    }
}

function filterByGender(qb: SelectQueryBuilder<Actor>, gender: any) {
    if (gender) {
        qb.andWhere("actor.gender = :gender", { gender })
    }
}

function filterByClothesSize(qb: SelectQueryBuilder<Actor>, clothes_size: any) {
    if (clothes_size) {
        qb.andWhere("actor.clothes_size = :clothes_size", { clothes_size })
    }
}

function filterByHeight(qb: SelectQueryBuilder<Actor>, minHeight: any, maxHeight: any) {
    if (minHeight || maxHeight) {
        if (minHeight && maxHeight) {
            qb.andWhere("actor.height BETWEEN :heightMin AND :heightMax", {
                heightMin: Number(minHeight),
                heightMax: Number(maxHeight)
            })
        } else if (minHeight) {
            qb.andWhere("actor.height >= :heightMin", { heightMin: Number(minHeight) })
        } else if (maxHeight) {
            qb.andWhere("actor.height <= :heightMax", { heightMax: Number(maxHeight) })
        }
    }
}

function filterByAge(qb: SelectQueryBuilder<Actor>, minAge: any, maxAge: any) {
    if (minAge || maxAge) {
        const now = new Date()
        const minBirthDate = maxAge ? new Date(now.getFullYear() - Number(maxAge), now.getMonth(), now.getDate()) : null
        const maxBirthDate = minAge ? new Date(now.getFullYear() - Number(minAge), now.getMonth(), now.getDate()) : null

        if (minBirthDate && maxBirthDate) {
            qb.andWhere("actor.date_of_birth BETWEEN :minBirth AND :maxBirth", {
                minBirth: minBirthDate.toISOString().split('T')[0],
                maxBirth: maxBirthDate.toISOString().split('T')[0]
            })
        } else if (minBirthDate) {
            qb.andWhere("actor.date_of_birth >= :minBirth", { minBirth: minBirthDate.toISOString().split('T')[0] })
        } else if (maxBirthDate) {
            qb.andWhere("actor.date_of_birth <= :maxBirth", { maxBirth: maxBirthDate.toISOString().split('T')[0] })
        }
    }
}


export async function filter(req: Request, res: Response): Promise<void> {
    const actorRepo = appDataSource.getRepository(Actor)
    const qb = actorRepo.createQueryBuilder("actor")
        .select(["actor.id", "actor.first_name", "actor.last_name", "actor.directory"])
        .leftJoin("actor.languages", "language")

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

    filterByAgent(qb, agent)
    filterByCities(qb, cities)
    filterByEyeColors(qb, eye_colors)
    filterByLanguages(qb, languages)
    filterByGender(qb, gender)
    filterByClothesSize(qb, clothes_size)
    filterByHeight(qb, minHeight, maxHeight)
    filterByAge(qb, minAge, maxAge)

    if (languages) {
        qb.groupBy("actor.id")
    }

    const actors = await qb.getMany()
    res.json(actors)
}
