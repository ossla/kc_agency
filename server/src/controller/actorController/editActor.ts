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
import { changePhoto, CustomFileType } from "../services/fileSystemService"


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

export async function changeAvatar(req: Request, res: Response, next: NextFunction) {
    try {
        const { actorId } = req.body 
        const newAvatar: CustomFileType = req.files?.newAvatar
        if (!newAvatar) throw new Error("changeAvatar: не найдено поле newAvatar")
    
        const actor: Actor = await getActor(Number(actorId))
    
        await changePhoto(newAvatar, "avatar.jpg", actor.directory)
        res.json(true)

    } catch (error) {
        processApiError(500, error, next)
    }
}

// при запросе change order нужно поменять порядок фото в поле actor.photos 
// порядок задается индексами в массиве, элементы массива string -- наименования файлов
// {"1.jpg", "5.jpg", "3.jpg"}
export async function changeOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const {currIdx, putAfterIdx, actorId} = req.body
        if (currIdx === undefined || putAfterIdx === undefined) {
            throw new Error("changeOrder: не найдено поле currPos или putAfterIdx")
        }
        if (!actorId) {
            throw new Error("changeOrder: не найдено поле actorId")
        }

        let actor: Actor = await getActor(Number(actorId))
        if (!actor.photos || actor.photos.length <= 0) {
            throw new Error("changeOrder: у актера нет фото")
        }

        const curr: number = Number(currIdx)
        const after: number = Number(putAfterIdx)
        const arrLength: number = actor.photos.length
        if (arrLength === 1) {
            return;
        }
        if (curr >= arrLength || after >= arrLength || curr < 0 || after < -1) { // after может быть -1, чтобы переставить объект на 0
            throw new Error(`changeOrder: неверная позиция. currIdx = ${curr}, putAfterIdx = ${after}, последний индекс = ${arrLength - 1}`)
        }
        const currEl: string = actor.photos[curr]
        if (curr < after) {
            for (let i = curr + 1; i <= after; ++i) {
                actor.photos[i-1] = actor.photos[i]
            }
            actor.photos[after] = currEl
        } else {
            for (let i = curr - 1; i > after; --i) {
                actor.photos[i+1] = actor.photos[i]
            }
            actor.photos[after + 1] = currEl
        }

        await appDataSource.getRepository(Actor).save(actor)
        res.json(actor)

    } catch (error) {
        processApiError(500, error, next)
    }
}
