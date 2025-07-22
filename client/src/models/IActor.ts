import { IAgent } from "./IAgent"
import { ICity } from "./ICity"
import { IEyeColor } from "./IEyeColor"
import { ILanguage } from "./ILanguage"

export interface IActor {
    id: number,
    firstName: string,
    lastName: string,
    middleName?: string,
    gender: string,
    dateOfBirth: Date,
    height?: number,
    clothesSize?: number,
    description?: string,
    directory: string,
    linkToKinoTeatr?: string,
    linkToFilmTools?: string,
    linkToKinopoisk?: string,
    video?: string,
    agent: IAgent,
    eyeColor?: IEyeColor,
    city?: ICity,
    languages?: ILanguage[],
    photos?: string[],
    createdAt: Date,
    updatedAt: Date
}

export function toIActor(raw: any): IActor {
    return {
        id: raw.id,
        firstName: raw.firstName,
        lastName: raw.lastName,
        middleName: raw.middleName,
        gender: raw.gender,
        dateOfBirth: new Date(raw.dateOfBirth),
        height: raw.height ?? undefined,
        clothesSize: raw.clothesSize,
        description: raw.description ?? undefined,
        directory: raw.directory ?? undefined,
        linkToKinoTeatr: raw.linkToKinoTeatr ?? undefined,
        linkToFilmTools: raw.linkToFilmTools ?? undefined,
        linkToKinopoisk: raw.linkToKinopoisk ?? undefined,
        video: raw.videoCode ?? undefined,
        agent: raw.agent ?? undefined,
        eyeColor: raw.eyeColor?.name ?? undefined,
        city: raw.city ?? undefined,
        languages: raw.languages ?? [],
        photos: raw.photos ?? [],
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),
    }
}
