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
        if (dirName != "") { // если папка с таким названием существует, dirName == ""
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

    await saveCity(actor, body.city)
    await saveColor(actor, body.eye_color)
    await saveLanguages(actor, body.languages)
}

// экспорты для editActor
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

// export async function saveLanguages(actor: Actor, rawLanguages: string | undefined) {
//     if (typeof rawLanguages === 'string' && rawLanguages.length) {
        
//         actor.languages = []

//         let langsArr: Array<Language> = new Array<Language>()
//         const languages: string[] = JSON.parse(rawLanguages)

//         for (let i = 0; i < languages.length; i++) {
//             let lang: Language | null = await appDataSource.getRepository(Language)
//                                                             .findOneBy({name: languages[i]})
//             if (!lang) {
//                 lang = new Language()
//                 lang.name = languages[i]
//                 await appDataSource.manager.save(lang)
//             }
            
//             langsArr.push(lang)
//         }
//         actor.languages = langsArr
//     }

// }

export async function saveLanguages(actor: Actor, rawLanguages: string[] | string | undefined) {
    if (!rawLanguages) {
        return;
    }

    let rawLangsArr: string[]
    if (typeof rawLanguages === 'string' && rawLanguages.length) {
        rawLangsArr = JSON.parse(rawLanguages)
    } else if (Array.isArray(rawLanguages)) {
        rawLangsArr = rawLanguages
    } else {
        throw new Error("languages должен быть или string или string[]")
    }
        
    actor.languages = []

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
