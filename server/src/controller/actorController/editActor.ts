import { Request, Response, NextFunction } from "express"
import { appDataSource } from "../../data-source"
import { getActor } from "./getActor"
import { Actor } from "../../entity/actor.entity"
import processApiError from "../../error/processError"
import { getAgent } from "../agentController/getAgent"
import { Agent } from "../../entity/agent.entity"
import { genderEnum } from "../services/types"
import { saveCity, saveColor, saveLanguages } from "./createActor"
import { CustomFileType } from "../services/fileSystemService"


interface IName {
    first?: string,
    last?: string,
    middle?: string
}
function setName(actor: Actor, name: IName) {
    if (name.first) {
        actor.first_name = name.first
    }
    if (name.last) {
        actor.last_name = name.last
    }
    if (name.middle) {
        actor.middle_name = name.middle
    }
}

interface ILinks {
    kinopoisk?: string,
    filmTools?: string,
    kinoTeatr?: string
}
function setLinks(actor: Actor, links: ILinks) {
    if (links.kinopoisk) {
        actor.link_to_kinopoisk = links.kinopoisk
    }
    if (links.filmTools) {
        actor.link_to_film_tools = links.filmTools
    }
    if (links.kinoTeatr) { 
        actor.link_to_kino_teatr = links.kinoTeatr
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
        actor.date_of_birth = new Date(dateOfBirth)
    }
}

function setClothesSize(actor: Actor, clothesSize: any) {
    if (clothesSize) {
        actor.clothes_size = Number(clothesSize)
    }
}

function setHeight(actor: Actor, height: any) {
    if (height) {
        actor.height = Number(height)
    }
}

function setGender(actor: Actor, gender: any) {
    if (gender) {
        if (gender === genderEnum.Man || gender === genderEnum.Woman) {
            actor.gender = gender
        } else {
            throw new Error("Под актера: 'M' или 'W'")
        }
    }
}

function setVideo(actor: Actor, videoCode?: string) {
    if (videoCode) {
        actor.video_code = videoCode
    }
}

export async function edit(req: Request, res: Response, next: NextFunction) {
    try {    
        const { id } = req.body
        const {
            first_name,
            last_name,
            middle_name,
            agentId,
            dateOfBirth,
            clothes_size,
            height,
            gender,
            city,
            eye_color,
            languages,
            linkToKinopoisk,
            linkToFilmTools,
            linkToKinoTeatr,
            videoCode,  
        } = req.body
        
        let actor: Actor = await getActor(Number(id))
        setName(actor, {first: first_name, last: last_name, middle: middle_name})        
        setLinks(actor, {kinopoisk: linkToKinopoisk, filmTools: linkToFilmTools, kinoTeatr: linkToKinoTeatr})
        setAge(actor, dateOfBirth)
        setClothesSize(actor, clothes_size)
        setHeight(actor, height)
        setGender(actor, gender)
        setVideo(actor, videoCode)

        await setAgent(actor, agentId)
        await saveCity(actor, city)
        await saveColor(actor, eye_color)
        await saveLanguages(actor, languages)

        await editPhotos(req)
        
        await appDataSource.getRepository(Actor).save(actor)
        res.json(actor)
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

async function editPhotos(req: Request) {
    const avatar: CustomFileType = req.files?.avatar

}