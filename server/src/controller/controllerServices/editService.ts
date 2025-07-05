import { appDataSource } from "../../data-source";
import { Actor } from "../../entity/actor.entity";
import { Agent } from "../../entity/agent.entity";
import { City } from "../../entity/city.entity";
import { EyeColor } from "../../entity/eyeColor.entity";
import { Language } from "../../entity/language.entity";
import { CreateActorType } from "../types";


async function saveCity(actor: Actor, body: CreateActorType) {
    let city: City | null = await appDataSource.getRepository(City)
                                        .findOne({where: {name: body.city}})
    if (city) {
        actor.city = city
    } else {
        const newCity = new City()
        newCity.name = body.city
        await appDataSource.getRepository(City).save(newCity)
        actor.city = newCity
    }
}

async function saveColor(actor: Actor, body: CreateActorType) {
    let eyeColor: EyeColor | null = await appDataSource.getRepository(EyeColor)
                                        .findOne({where: {name: body.eye_color}})
    if (eyeColor) {
        actor.eye_color = eyeColor
    } else {
        const newEyeColor = new EyeColor()
        newEyeColor.name = body.eye_color
        await appDataSource.getRepository(EyeColor).save(newEyeColor)
        actor.eye_color = newEyeColor
    }
}

async function saveLanguages(actor: Actor, body: CreateActorType) {
    actor.languages = []

    let langsArr: Array<Language> = new Array<Language>()
    if (typeof body.languages === 'string' && body.languages.length) {
        const languages: string = JSON.parse(body.languages)

        for (let i = 0; i < languages.length; i++) {
            let lang: Language | null = await appDataSource.getRepository(Language)
                                                            .findOneBy({name: languages[i]})
            if (lang) {
                langsArr.push(lang)
            } else {
                const newLang = new Language()
                newLang.name = languages[i]
                await appDataSource.manager.save(newLang)
                langsArr.push(newLang)
            }
        }
    }

    actor.languages = langsArr
}


export async function generateActor(actor: Actor, body: CreateActorType)
                                                            : Promise<void> {
                                                                
    const agent: Agent = await appDataSource.getRepository(Agent)
                                                    .findOne({where: {id: body.agent}})
    if (!agent) {
        throw new Error("Такого агента нет!")
    }                                                            
    actor.first_name = body.first_name
    actor.last_name  = body.last_name
    actor.middle_name = body.middle_name ?? null
    actor.date_of_birth = body.date_of_birth.toISOString().split('T')[0];
    actor.height = body.height ?? null
    actor.clothes_size = body.clothes_size ?? null
    actor.description = body.description ?? null
    actor.link_to_kino_teatr = body.kino_teatr ?? null
    actor.link_to_film_tools = body.film_tools ?? null
    actor.link_to_kinopoisk = body.kinopoisk ?? null
    actor.video = body.video ?? null

    saveCity(actor, body)
    saveColor(actor, body)
    saveLanguages(actor, body)
}

// export async function updateActor(actor: Actor, body: CreateActorType)
//                                                             : Promise<void> {
//     if (body.first_name) {
//         actor.first_name = body.first_name
//     }
//     if (body.last_name) {
//         actor.last_name  = body.last_name
//     }
//     if (body.middle_name) {
//         actor.middle_name = body.middle_name
//     }
//     if (body.date_of_birth) {
//         actor.date_of_birth = body.date_of_birth.toISOString().split('T')[0];
//     }
//     if (body.height) {
//         actor.height = body.height
//     }
//     if (body.clothes_size) {
//         actor.clothes_size = body.clothes_size
//     }
//     if (body.description) {
//         actor.description = body.description
//     }
//     // if (body.)
//     actor.link_to_kino_teatr = body.kino_teatr
//     actor.link_to_film_tools = body.film_tools
//     actor.link_to_kinopoisk = body.kinopoisk
//     actor.video = body.video
//     const agent: Agent = await appDataSource.getRepository(Agent)
//                                                         .findOne({where: {id: body.agent}})
//     if (!agent) {
//         throw new Error("Такого агента нет!")
//     }
// }