import { serverURL } from "../URLs";
import { IEmployee } from "./employeeTypes"
import { GenderEnum } from "./enums"
import { ICity, IEyeColor, IHairColor, ILanguage } from "./relevantTypes"

// Типы для api хранятся в данном файле:
// * REQUEST для формирования запроса
// * RESPONSE для парсинга входящих данных

// ================================ REQUEST ================================
export interface CreateActorType {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    employeeId: number;
    gender: GenderEnum;

    middleName?: string;
    city?: string;
    eyeColor?: string;
    height?: number;
    clothesSize?: number;
    video?: string;
    languages?: string[];
    description?: string;
    kinoTeatr?: string;
    filmTools?: string;
    kinopoisk?: string;
}

export interface EditActorType {
    id: number;

    firstName?: string;
    lastName?: string;
    middleName?: string;
    employeeId?: number;
    gender?: GenderEnum;
    dateOfBirth?: Date;
    city?: string;
    eyeColor?: string;
    height?: number;
    clothesSize?: number;
    video?: string;
    languages?: string[];
    description?: string;
    kinoTeatr?: string;
    filmTools?: string;
    kinopoisk?: string;
}

export interface FilterActorType {
    search?: string;
    employeeId?: number;
    minAge?: number;
    maxAge?: number;
    minHeight?: number;
    maxHeight?: number;
    clothesSize?: number;
    gender?: GenderEnum;
    cityIds?: number[];
    eyeIds?: number[];
    languageIds?: number[];
}


// ================================ RESPONSE ================================
export interface IActor {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    gender: string;
    dateOfBirth: Date;
    height?: number;
    clothesSize?: number;
    description?: string;
    directory: string;
    url: string;
    linkToKinoTeatr?: string;
    linkToFilmTools?: string;
    linkToKinopoisk?: string;
    videoURL: string;
    employee: IEmployee;
    education: string;
    hairColor?: IHairColor;
    eyeColor?: IEyeColor;
    city?: ICity;
    skills?: string[];
    languages?: ILanguage[];
    photos: string[];
    createdAt: Date;
    updatedAt: Date;
}

export function toIActor(raw: any): IActor {
    return {
        id: Number(raw.id),
        firstName: raw.firstName,
        lastName: raw.lastName,
        middleName: raw.middleName ?? undefined,
        gender: raw.gender,
        education: raw.education,
        dateOfBirth: new Date(raw.dateOfBirth),
        height: raw.height ?? undefined,
        clothesSize: raw.clothesSize,
        description: raw.description ?? undefined,
        directory: raw.directory,
        url: serverURL + "/" + raw.directory,
        linkToKinoTeatr: raw.linkToKinoTeatr ?? undefined,
        linkToFilmTools: raw.linkToFilmTools ?? undefined,
        linkToKinopoisk: raw.linkToKinopoisk ?? undefined,
        videoURL: raw.videoCode ?? undefined,
        employee: raw.employee ?? undefined,
        eyeColor: raw.eyeColor ?? undefined,
        city: raw.city ?? undefined,
        skills: raw.skills ?? undefined,
        languages: raw.languages ?? [],
        photos: raw.photos ?? [],
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt)
    }
}

export interface IShortActor {
    id: number,
    firstName: string,
    lastName: string,
    directory: string,
    avatarUrl: string
}

export function toIShortActor(raw: any): IShortActor{
    return {
        id: Number(raw.id),
        firstName: raw.firstName,
        lastName: raw.lastName,
        directory: raw.directory,
        avatarUrl: `${serverURL}/${raw.directory}/avatar.jpg`
    }
}
