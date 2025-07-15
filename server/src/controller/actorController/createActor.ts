import { NextFunction, Response } from "express"

import { ICustomRequest } from "../../middleware/checkMiddleware"
import { CustomFileType, makeActorDirectory, removeActorFolder, savePhoto, savePhotos } from "../services/fileSystemService"
import { Actor } from "../../entity/actor.entity"
import { appDataSource } from "../../data-source"
import processApiError from "../../error/processError"
import { CreateActorSchema, CreateActorType, genderEnum } from "../services/types"
import { Language } from "../../entity/language.entity"
import { EyeColor } from "../../entity/eyeColor.entity"
import { City } from "../../entity/city.entity"
import { getAgent } from "../agentController/getAgent"


export async function create(req: ICustomRequest, res: Response, next: NextFunction) : Promise<void> {
    let dirName: string = ""
    try {
        console.log("create actor controller starts...")
        const body: CreateActorType = CreateActorSchema.parse(req.body)

        const avatar: CustomFileType = req.files?.avatar
        if (!avatar) throw new Error('Нужно добавить аватарку актера')
        const photos: CustomFileType = req.files?.photos
        if (!photos) throw new Error('Нужно добавить хотя бы одно фото')
        dirName = await makeActorDirectory(body)
        await savePhoto(avatar, "avatar.jpg", dirName)
        await savePhotos(photos, dirName)

        const actor: Actor = new Actor()
        actor.directory = dirName
        await generateActor(actor, body)

        await appDataSource.getRepository(Actor).save(actor)

        res.status(200).json(actor)

    } catch (error: unknown) {
        if (dirName != "") {
            await removeActorFolder(dirName)
        }
        processApiError(404, error, next)
    }
} // create

export async function generateActor(actor: Actor, body: CreateActorType)
                                                            : Promise<void> {
                                                                                                                            
    actor.agent = await getAgent(Number(body.agentId))                                             
    actor.first_name = body.first_name
    actor.last_name  = body.last_name
    if (body.gender === genderEnum.Man || body.gender === genderEnum.Woman) {
        actor.gender = body.gender
    } else {
        throw new Error(`Неверно указан пол актера: ${body.gender}`)
    }
    actor.middle_name = body.middle_name ?? null
    actor.date_of_birth = body.date_of_birth;
    actor.height = body.height ? Number(body.height) : null
    actor.clothes_size = body.clothes_size ?? null
    actor.description = body.description ?? null
    actor.link_to_kino_teatr = body.kino_teatr ?? null
    actor.link_to_film_tools = body.film_tools ?? null
    actor.link_to_kinopoisk = body.kinopoisk ?? null
    actor.video = body.video ?? null

    await saveCity(actor, body)
    await saveColor(actor, body)
    await saveLanguages(actor, body)
}

async function saveCity(actor: Actor, body: CreateActorType) {
    let city: City | null = await appDataSource.getRepository(City)
                                        .findOne({where: {name: body.city}})
    if (!city) {
        city = new City();
        city.name = body.city;
        await appDataSource.getRepository(City).save(city);
    }

    actor.city = city
}

async function saveColor(actor: Actor, body: CreateActorType) {
    let eyeColor: EyeColor | null = await appDataSource.getRepository(EyeColor)
                                        .findOne({where: {name: body.eye_color}})
    if (!eyeColor) {     
        eyeColor = new EyeColor()
        eyeColor.name = body.eye_color
        await appDataSource.getRepository(EyeColor).save(eyeColor)
    }
    
    actor.eye_color = eyeColor
}

async function saveLanguages(actor: Actor, body: CreateActorType) {
    actor.languages = []

    let langsArr: Array<Language> = new Array<Language>()
    if (typeof body.languages === 'string' && body.languages.length) {
        const languages: string = JSON.parse(body.languages)

        for (let i = 0; i < languages.length; i++) {
            let lang: Language | null = await appDataSource.getRepository(Language)
                                                            .findOneBy({name: languages[i]})
            if (!lang) {
                lang = new Language()
                lang.name = languages[i]
                await appDataSource.manager.save(lang)
            }
            
            langsArr.push(lang)
        }
    }

    actor.languages = langsArr
}


