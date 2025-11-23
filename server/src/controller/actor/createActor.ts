import { NextFunction, Response } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { CustomFileType, makeActorDirectory, removeActorFolder, saveActorPhotos, savePhoto } from "../services/fileSystemService"
import { Actor } from "../../models/actor.entity"
import { appDataSource } from "../../data-source"
import processApiError from "../../error/processError"
import { createActorSchema, CreateActorType, GenderEnum } from "./actorTypes"
import { Language } from "../../models/language.entity"
import { EyeColor } from "../../models/eyeColor.entity"
import { City } from "../../models/city.entity"
import { getEmployee } from "../employee/getEmployee"
import ApiError from "../../error/apiError"


export async function createActor(req: ICustomRequest, res: Response, next: NextFunction) {
    let dirname: string = ""
    try {
        console.log("create actor controller starts...")
        const actor: Actor = new Actor()
        const body: CreateActorType = createActorSchema.parse(req.body)

        dirname = await processActorFiles(req, body, actor)
        await fillActor(actor, body)

        await appDataSource.getRepository(Actor).save(actor)

        res.status(201).json(actor)

    } catch (error: unknown) {
        // если папка другого актера существует, dirname == "", удалять ее не надо
        if (dirname != "") {
            await removeActorFolder(dirname)
        }
        processApiError(error, next)
    }
} // create

// получение avatar.jpg и фотографий для альбома актера.
async function processActorFiles(req: ICustomRequest, body: CreateActorType, actor: Actor)
                                                            : Promise<string> {
    let dirname: string;
    const avatar: CustomFileType = req.files?.avatar
    if (!avatar) throw new ApiError(400, 'Нужно добавить аватарку актера')
    const photos: CustomFileType = req.files?.photos
    if (!photos) throw new ApiError(400, 'Нужно добавить хотя бы одно фото')

    dirname = await makeActorDirectory(body)
    actor.directory = dirname
    await savePhoto(avatar, "avatar.jpg", dirname) // сохранение авы
    actor.photos = await saveActorPhotos(photos, actor.directory) // сохранение фото для альбома
    return dirname
}

// заполнение полей (помимо photos) и связей с другими таблицами
async function fillActor(actor: Actor, body: CreateActorType) {                         
    actor.employee = await getEmployee(Number(body.employeeId))
    actor.firstName = body.firstName
    actor.lastName  = body.lastName
    if (body.gender === GenderEnum.Man || body.gender === GenderEnum.Woman) {
        actor.gender = body.gender
    } else {
        throw new ApiError(400, `create: Неверно указан пол актера: ${body.gender}`)
    }
    actor.middleName = body.middleName ?? null
    actor.dateOfBirth = body.dateOfBirth;
    actor.height = body.height ? Number(body.height) : null
    actor.clothesSize = body.clothesSize ?? null
    actor.description = body.description ?? null
    actor.linkToKinoTeatr = body.kinoTeatr ?? null
    actor.linkToFilmTools = body.filmTools ?? null
    actor.linkToKinopoisk = body.kinopoisk ?? null
    actor.videoCode = body.video ?? null

    await saveCity(actor, body.city)
    await saveColor(actor, body.eyeColor)
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

        actor.eyeColor = eyeColor
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
            throw new ApiError(400, "Некорректный JSON в поле languages")
        }

    } else if (Array.isArray(rawLanguages)) {
        rawLangsArr = rawLanguages
    } else {
        throw new ApiError(400, "languages должен быть или string или string[]")
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
