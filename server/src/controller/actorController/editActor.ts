import { Request, Response, NextFunction } from "express"

import { appDataSource } from "../../data-source"
import { getActor } from "./getActor"
import { Actor } from "../../entity/actor.entity"
import processApiError from "../../error/processError"
import { getAgent } from "../agentController/getAgent"
import { Agent } from "../../entity/agent.entity"
import { GenderEnum } from "../services/types"
import { saveCity, saveColor, saveLanguages } from "./createActor"


interface IName {
    first?: string,
    last?: string,
    middle?: string
}
function setName(actor: Actor, name: IName) {
    if (name.first) {
        actor.firstName = name.first
    }
    if (name.last) {
        actor.lastName = name.last
    }
    if (name.middle) {
        actor.middleName = name.middle
    }
}

interface ILinks {
    kinopoisk?: string,
    filmTools?: string,
    kinoTeatr?: string
}
function setLinks(actor: Actor, links: ILinks) {
    if (links.kinopoisk) {
        actor.linkToKinopoisk = links.kinopoisk
    }
    if (links.filmTools) {
        actor.linkToFilmTools = links.filmTools
    }
    if (links.kinoTeatr) { 
        actor.linkToKinoTeatr = links.kinoTeatr
    }
}

async function setAgent(actor: Actor, agentId: any) {
    if (agentId) {
        const agent: Agent = await getAgent(Number(agentId))
        actor.agent = agent
    }
}

function setAge(actor: Actor, dateOfBirth: any) {
    if (dateOfBirth) {
        actor.dateOfBirth = new Date(dateOfBirth)
    }
}

function setClothesSize(actor: Actor, clothesSize: any) {
    if (clothesSize) {
        actor.clothesSize = Number(clothesSize)
    }
}

function setHeight(actor: Actor, height: any) {
    if (height) {
        actor.height = Number(height)
    }
}

function setGender(actor: Actor, gender: any) {
    if (gender) {
        if (gender === GenderEnum.Man || gender === GenderEnum.Woman) {
            actor.gender = gender
        } else {
            throw new Error("setGender: Под актера: 'M' или 'W'")
        }
    }
}

function setVideo(actor: Actor, video?: string) {
    if (video) {
        actor.videoCode = video
    }
}

function setDescription(actor: Actor, description?: string) {
    if (description) {
        actor.description = description
    }
}

export async function edit(req: Request, res: Response, next: NextFunction) {
    try {    
        const {
            id,
            firstName,
            lastName,
            middleName,
            dateOfBirth,
            agentId,
            gender,
            height,
            clothesSize,
            video,  
            description,
            linkToKinoTeatr,
            linkToFilmTools,
            linkToKinopoisk,
            languages,
            eyeColor,
            city,
        } = req.body
        
        let actor: Actor = await getActor(Number(id))
        setName(actor, {first: firstName, last: lastName, middle: middleName})        
        setLinks(actor, {kinopoisk: linkToKinopoisk, filmTools: linkToFilmTools, kinoTeatr: linkToKinoTeatr})
        setAge(actor, dateOfBirth)
        setClothesSize(actor, clothesSize)
        setHeight(actor, height)
        setGender(actor, gender)
        setVideo(actor, video)
        setDescription(actor, description)

        await setAgent(actor, agentId)
        await saveCity(actor, city)
        await saveColor(actor, eyeColor)
        await saveLanguages(actor, languages)
        
        await appDataSource.getRepository(Actor).save(actor)
        res.json(actor)
    } catch (error: unknown) {
        processApiError(500, error, next)
    }
}
