import { Request, Response, NextFunction } from "express"

import { appDataSource } from "../../data-source"
import { getActor } from "./getActor"
import { Actor } from "../../models/actor.entity"
import processApiError from "../../error/processError"
import { getAgent } from "../agent/getAgent"
import { Agent } from "../../models/agent.entity"
import { editActorSchema, EditActorType, GenderEnum } from "./actorTypes"
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
        const body: EditActorType = editActorSchema.parse(req.body)
        
        let actor: Actor = await getActor(body.id)
        setName(actor, {first: body.firstName, last: body.lastName, middle: body.middleName})        
        setLinks(actor, {kinopoisk: body.kinopoisk, filmTools: body.filmTools, kinoTeatr: body.kinoTeatr})
        setAge(actor, body.dateOfBirth)
        setClothesSize(actor, body.clothesSize)
        setHeight(actor, body.height)
        setGender(actor, body.gender)
        setVideo(actor, body.video)
        setDescription(actor, body.description)

        await setAgent(actor, body.agentId)
        await saveCity(actor, body.city)
        await saveColor(actor, body.eyeColor)
        await saveLanguages(actor, body.languages)
        
        await appDataSource.getRepository(Actor).save(actor)
        res.json(actor)
    } catch (error: unknown) {
        processApiError(500, error, next)
    }
}
