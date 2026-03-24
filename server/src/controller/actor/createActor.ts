import { NextFunction, Response } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { CustomFileType, makeActorDirectory, removeActorFolder, saveActorPhotos, savePhoto } from "../services/fileSystemService"
import { Actor } from "../../models/actor.entity"
import { appDataSource } from "../../data-source"
import { createActorSchema, CreateActorType, GenderEnum } from "./actorTypes"
import { Language } from "../../models/language.entity"
import { EyeColor } from "../../models/eyeColor.entity"
import { City } from "../../models/city.entity"
import { getEmployee } from "../employee/getEmployee"
import ApiError from "../../error/apiError"
import { HairColor } from "../../models/hairColor.entity"


export async function createActor(req: ICustomRequest, res: Response, next: NextFunction) {
    let dirname: string;
    try {
        console.log("[createActor] start...")
        const actor: Actor = new Actor()
        const body: CreateActorType = createActorSchema.parse(req.body)

        dirname = await processActorFiles(req, body, actor)
        console.log("[createActor] files saved")

        await fillActor(actor, body)
        console.log("[createActor] actor fields ")

        await appDataSource.getRepository(Actor).save(actor)
        console.log("[createActor] sql fields are filled, actor saved in repository")

        console.log("[createActor] end")
        res.status(201).json(actor)

    } catch (error: unknown) {
        if (dirname != "") {
            await removeActorFolder(dirname)
        }
        throw error
    }
} // create

// получение avatar.jpg и фотографий для альбома актера.
async function processActorFiles(req: ICustomRequest, body: CreateActorType, actor: Actor)
                                                            : Promise<string> {
    let dirname: string
    try {
        console.log(">[processActorFiles] start...")
        const avatar: CustomFileType = req.files?.avatar
        if (!avatar) throw ApiError.badRequest('Нужно добавить аватарку актера')
        const photos: CustomFileType = req.files?.photos
        if (!photos) throw ApiError.badRequest('Нужно добавить хотя бы одно фото')

        console.log("[processActorFiles] avatar and photo successfully loaded")
        dirname = await makeActorDirectory(body)
        
        console.log("[processActorFiles] actor directory successfully created")
        actor.directory = dirname

        await savePhoto(avatar, "avatar", dirname) // сохранение авы
        console.log("[processActorFiles] saved avatar")

        actor.photos = await saveActorPhotos(photos, actor.directory) // сохранение фото для альбома
        console.log("[processActorFiles] photos saved in album")

        console.log("[processActorFiles] end. No errors occured")
        return dirname

    } catch (error: unknown) {
        if (dirname != "") {
            console.log("[processActorFiles] error occured. RemoveActorFolder")
            await removeActorFolder(dirname)
        }
        throw error
    }
}

// заполнение полей (помимо файлов)
async function fillActor(actor: Actor, body: CreateActorType) {                         
    // обязательные поля
    console.log("[fillActor] start... (filling fields in actor type)")
    actor.firstName = body.firstName
    actor.lastName  = body.lastName
    actor.dateOfBirth = body.dateOfBirth
    actor.employee = await getEmployee(body.employeeId)
    if (body.gender === GenderEnum.Man || body.gender === GenderEnum.Woman) {
        actor.gender = body.gender
    } else {
        throw ApiError.badRequest(`[fillActor] Неверно указан пол актера: ${body.gender}`)
    }
    await saveEyeColor(actor, body.eyeColor)
    await saveCity(actor, body.city)
    await saveHairColor(actor, body.hairColor)
    actor.height = Number(body.height)
    await saveLanguages(actor, body.languages)
    saveSkills(actor, body.skills)

    // необязательные
    actor.middleName = body.middleName ?? null
    actor.videoURL = body.videoURL ?? null
    actor.description = body.description ?? null
    actor.education = body.education ?? null
    actor.linkToKinoTeatr = body.linkToKinoTeatr ?? null
    actor.linkToFilmTools = body.linkToFilmTools ?? null
    actor.linkToKinopoisk = body.linkToKinopoisk ?? null
    console.log("[fillActor] end")
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
export async function saveEyeColor(actor: Actor, rawColor: string | undefined) {
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

export async function saveHairColor(actor: Actor, rawColor: string | undefined) {
    if (typeof rawColor === 'string' && rawColor.length) {
        let hairColor: HairColor | null = await appDataSource.getRepository(HairColor)
        .findOne({where: {name: rawColor}})
        if (!hairColor) {     
            hairColor = new HairColor()
            hairColor.name = rawColor
            await appDataSource.getRepository(HairColor).save(hairColor)
        }

        actor.hairColor = hairColor
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
            throw ApiError.badRequest("Некорректный JSON в поле languages")
        }

    } else if (Array.isArray(rawLanguages)) {
        rawLangsArr = rawLanguages
    } else {
        throw ApiError.badRequest('languages должен быть или string или string[], например ["English", "Belorussian"]')
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

export async function saveSkills(actor: Actor, rawSkills: string[] | string | undefined) {
    if (!rawSkills) {
        return;
    }

    let rawSkillsArr: string[]
    if (typeof rawSkills === 'string' && rawSkills.length) {
        try {
            rawSkillsArr = JSON.parse(rawSkills)
            if (!Array.isArray(rawSkillsArr)) throw new Error()
        } catch {
            throw ApiError.badRequest("Некорректный JSON в поле languages")
        }

    } else if (Array.isArray(rawSkills)) {
        rawSkillsArr = rawSkills
    } else {
        throw ApiError.badRequest('skills должен быть или string или string[], например ["Лыжный спорт", "игра на гитаре"]')
    }

    actor.skills = rawSkillsArr
}
