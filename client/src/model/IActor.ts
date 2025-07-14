import { IAgent } from "./IAgent"
import { ICity } from "./ICity"
import { IEyeColor } from "./IEyeColor"
import { ILanguage } from "./ILanguage"


export interface IActor {
    id: number,
    first_name: string,
    last_name: string,
    middle_name?: string,
    gender: string,
    date_of_birth: Date,
    height?: number,
    clothes_size?: number,
    description?: string,
    avatarUrl: string,
    link_to_kino_teatr?: string,
    link_to_film_tools?: string,
    link_to_kinopoisk?: string,
    video?: string,
    agent: IAgent,
    eye_color?: IEyeColor,
    city?: ICity,
    languages?: ILanguage[],
    createdAt: Date
    updatedAt: Date
}

export function toIActor(raw: any): IActor {
    return {
        id: raw.id,
        first_name: raw.first_name,
        last_name: raw.last_name,
        middle_name: raw.middle_name,
        gender: raw.gender,
        date_of_birth: new Date(raw.date_of_birth),
        height: raw.height ?? undefined,
        clothes_size: raw.clothes_size,
        description: raw.description ?? undefined,
        avatarUrl: `http://localhost:3001/${raw.directory}/avatar.jpg`,
        link_to_kino_teatr: raw.link_to_kino_teatr ?? undefined,
        link_to_film_tools: raw.link_to_film_tools ?? undefined,
        link_to_kinopoisk: raw.link_to_kinopoisk ?? undefined,
        video: raw.video ?? undefined,
        agent: raw.agent ?? undefined,
        eye_color: raw.eye_color?.name ?? undefined,
        city: raw.city ?? undefined,
        languages: raw.languages ?? [],
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),
    }
}
