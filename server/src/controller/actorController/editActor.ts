import { Request, Response, NextFunction } from "express"
import * as fs from "fs"

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

function setVideo(actor: Actor, videoCode?: string) {
    if (videoCode) {
        actor.videoCode = videoCode
    }
}

export async function edit(req: Request, res: Response, next: NextFunction) {
    try {    
        const { id } = req.body
        const {
            firstName,
            lastName,
            middleName,
            agentId,
            dateOfBirth,
            clothesSize,
            height,
            gender,
            city,
            eyeColor,
            languages,
            linkToKinopoisk,
            linkToFilmTools,
            linkToKinoTeatr,
            videoCode,  
        } = req.body
        
        let actor: Actor = await getActor(Number(id))
        setName(actor, {first: firstName, last: lastName, middle: middleName})        
        setLinks(actor, {kinopoisk: linkToKinopoisk, filmTools: linkToFilmTools, kinoTeatr: linkToKinoTeatr})
        setAge(actor, dateOfBirth)
        setClothesSize(actor, clothesSize)
        setHeight(actor, height)
        setGender(actor, gender)
        setVideo(actor, videoCode)

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
