import { NextFunction, Request, Response } from "express"
import { SelectQueryBuilder } from "typeorm"

import { appDataSource } from "../../data-source"
import { Actor } from "../../models/actor.entity"
import processApiError from "../../error/processError"
import { GenderEnum, FilterActorType, filterActorSchema } from "./actorTypes"


// select * from actor WHERE LOWER(CONCAT_WS(' ', "lastName", "firstName", "middleName")) ILIKE '%arn%';
function filterSearch(qb: SelectQueryBuilder<Actor>, search: any) {
    if (search) {
        qb.andWhere(`LOWER(CONCAT_WS(' ', actor.lastName, actor.firstName, actor.middleName)) ILIKE :search`,
        { search: `%${(search as string).toLowerCase()}%` })
    }
}

function filterByAgent(qb: SelectQueryBuilder<Actor>, agent: any) {
    if (agent) {
        qb.andWhere("actor.agent.id = :agentId", { agentId: Number(agent) })
    }
}

function filterByCities(qb: SelectQueryBuilder<Actor>, cities?: number[]) {
  if (cities && cities.length > 0) {
    qb.andWhere("actor.city_id IN (:...cityIds)", { cityIds: cities });
  }
}

function filterByEyeColors(qb: SelectQueryBuilder<Actor>, eyeColors?: number[]) {
  if (eyeColors && eyeColors.length > 0) {
    qb.andWhere("actor.eye_color_id IN (:...eyeColorIds)", { eyeColorIds: eyeColors });
  }
}

function filterByLanguages(qb: SelectQueryBuilder<Actor>, languages?: number[]) {
  if (languages && languages.length > 0) {
    qb.andWhere("language.id IN (:...languageIds)", { languageIds: languages });
  }
}

function filterByGender(qb: SelectQueryBuilder<Actor>, gender: any) {
    if (gender) {
        if (gender === GenderEnum.Man || gender === GenderEnum.Woman) {
            qb.andWhere("actor.gender = :gender", { gender })
        } else {
            throw new Error("filterByGender: Под актера: 'M' или 'W'")
        }
    }
}

function filterByClothesSize(qb: SelectQueryBuilder<Actor>, clothesSize: any) {
    if (clothesSize) {
        qb.andWhere("actor.clothesSize = :clothesSize", { clothesSize })
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
        let minBirthDate: Date | null = null
        let maxBirthDate: Date | null = null
        if (maxAge) {
            maxBirthDate = new Date(now.getFullYear() - Number(maxAge), now.getMonth(), now.getDate())
        }
        if (minAge) {
            minBirthDate = new Date(now.getFullYear() - Number(minAge), now.getMonth(), now.getDate())
        }

        if (minBirthDate && maxBirthDate) {
            qb.andWhere("actor.dateOfBirth BETWEEN :minBirth AND :maxBirth", {
                minBirth: minBirthDate.toISOString().split('T')[0],
                maxBirth: maxBirthDate.toISOString().split('T')[0]
            })
        } else if (minBirthDate) {
            qb.andWhere("actor.dateOfBirth >= :minBirth", { minBirth: minBirthDate.toISOString().split('T')[0] })
        } else if (maxBirthDate) {
            qb.andWhere("actor.dateOfBirth <= :maxBirth", { maxBirth: maxBirthDate.toISOString().split('T')[0] })
        }
    }
}

export async function filter(req: Request, res: Response, next: NextFunction) {
    try {
        const body: FilterActorType = filterActorSchema.parse(req.body)
        
        const actorRepo = appDataSource.getRepository(Actor)
        const qb = actorRepo.createQueryBuilder("actor")
            .select(["actor.id", "actor.firstName", "actor.lastName", "actor.directory"])
            .leftJoin("actor.languages", "language")

        filterSearch(qb, body.search)
        filterByAgent(qb, body.agentId)
        filterByCities(qb, body.cityIds)
        filterByEyeColors(qb, body.eyeIds)
        filterByGender(qb, body.gender)
        filterByClothesSize(qb, body.clothesSize)
        filterByHeight(qb, body.minHeight, body.maxHeight)
        filterByAge(qb, body.minAge, body.maxAge)
        
        if (body.languageIds) {
            filterByLanguages(qb, body.languageIds)
            qb.groupBy("actor.id")
        }
        if (body.cityIds && body.cityIds.length > 0) {
           filterByCities(qb, body.cityIds)
        }
        if (body.eyeIds && body.eyeIds.length > 0) {
            filterByEyeColors(qb, body.eyeIds)
        }

        const actors = await qb.getMany()
        res.json(actors)
    } catch (error: unknown) {
        processApiError(error, next)
    }
}
