import { NextFunction, Response } from "express"
import path from "path"

import { ICustomRequest } from "../../middleware/checkMiddleware"
import { CustomFileType, makeActorDirectory, removeActorFolder, returnStaticPath, saveActorPhotos, savePhoto } from "../services/fileSystemService"
import { Actor } from "../../entity/actor.entity"
import { appDataSource } from "../../data-source"
import processApiError from "../../error/processError"
import { CreateActorSchema, CreateActorType, genderEnum } from "../services/types"
import { Language } from "../../entity/language.entity"
import { EyeColor } from "../../entity/eyeColor.entity"
import { City } from "../../entity/city.entity"
import { getAgent } from "../agentController/getAgent"


export async function create(req: ICustomRequest, res: Response, next: NextFunction) {
    let dirname: string = ""
    try {
        console.log("create actor controller starts...")
        const actor: Actor = new Actor()
        const body: CreateActorType = CreateActorSchema.parse(req.body)

        dirname = await processActorFiles(req, body, actor)
        await fillActor(actor, body)

        await appDataSource.getRepository(Actor).save(actor)

        res.status(200).json(actor)

    } catch (error: unknown) {
        // если папка другого актера существует, dirname == "", удалять ее не надо
        if (dirname != "") {
            await removeActorFolder(dirname)
        }
        processApiError(404, error, next)
    }
} // create

// получение avatar.jpg и фотографий для альбома актера.
async function processActorFiles(req: ICustomRequest, body: CreateActorType, actor: Actor)
                                                            : Promise<string> {
    let dirname: string;
    console.log("check if files received...");
    const avatar: CustomFileType = req.files?.avatar
    if (!avatar) throw new Error('Нужно добавить аватарку актера')
    const photos: CustomFileType = req.files?.photos
    if (!photos) throw new Error('Нужно добавить хотя бы одно фото')

    console.log("making directory");
    dirname = await makeActorDirectory(body)
    actor.directory = dirname
    await savePhoto(avatar, "avatar.jpg", dirname) // сохранение авы
    console.log("avatar.jpg saved")
    actor.photos = await saveActorPhotos(photos, actor.directory) // сохранение фото для альбома
    console.log("actor photos saved");
    return dirname
}

// заполнение полей (помимо photos) и связей с другими таблицами
async function fillActor(actor: Actor, body: CreateActorType) {                         
    actor.agent = await getAgent(Number(body.agentId))
    actor.first_name = body.first_name
    actor.last_name  = body.last_name
    if (body.gender === genderEnum.Man || body.gender === genderEnum.Woman) {
        actor.gender = body.gender
    } else {
        throw new Error(`create: Неверно указан пол актера: ${body.gender}`)
    }
    actor.middle_name = body.middle_name ?? null
    actor.date_of_birth = body.date_of_birth;
    actor.height = body.height ? Number(body.height) : null
    actor.clothes_size = body.clothes_size ?? null
    actor.description = body.description ?? null
    actor.link_to_kino_teatr = body.kino_teatr ?? null
    actor.link_to_film_tools = body.film_tools ?? null
    actor.link_to_kinopoisk = body.kinopoisk ?? null
    actor.video_code = body.video ?? null

    await saveCity(actor, body.city)
    await saveColor(actor, body.eye_color)
    await saveLanguages(actor, body.languages)
}


// экспорт для editActor
export async function saveCity(actor: Actor, rawCity: string | undefined) {
    if (typeof rawCity === 'string' && rawCity.length) {
        let city: City | null = await appDataSource.getRepository(City)
                                            .findOne({where: {name: rawCity}})
        if (!city) {
            city = new City();
            city.name = rawCity;
            await appDataSource.getRepository(City).save(city);
        }

        actor.city = city
    }
}

// экспорт для editActor
export async function saveColor(actor: Actor, rawColor: string | undefined) {
    if (typeof rawColor === 'string' && rawColor.length) {
        let eyeColor: EyeColor | null = await appDataSource.getRepository(EyeColor)
        .findOne({where: {name: rawColor}})
        if (!eyeColor) {     
            eyeColor = new EyeColor()
            eyeColor.name = rawColor
            await appDataSource.getRepository(EyeColor).save(eyeColor)
        }

        actor.eye_color = eyeColor
    }
}

// экспорт для editActor
export async function saveLanguages(actor: Actor, rawLanguages: string[] | string | undefined) {
    if (!rawLanguages) {
        return;
    }

    let rawLangsArr: string[]
    if (typeof rawLanguages === 'string' && rawLanguages.length) {
        try {
            rawLangsArr = JSON.parse(rawLanguages)
            if (!Array.isArray(rawLangsArr)) throw new Error()
        } catch {
            throw new Error("Некорректный JSON в поле languages")
        }

    } else if (Array.isArray(rawLanguages)) {
        rawLangsArr = rawLanguages
    } else {
        throw new Error("languages должен быть или string или string[]")
    }

    let langsArr: Array<Language> = new Array<Language>()

    for (let i = 0; i < rawLangsArr.length; i++) {
        let lang: Language | null = await appDataSource.getRepository(Language)
                                                        .findOneBy({name: rawLangsArr[i]})
        if (!lang) {
            lang = new Language()
            lang.name = rawLangsArr[i]
            await appDataSource.manager.save(lang)
        }
        
        langsArr.push(lang)
    }
    actor.languages = langsArr

}
