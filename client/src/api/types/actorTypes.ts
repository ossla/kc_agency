import { serverURL } from "../URLs";
import { IEmployee } from "./employeeTypes"
import { GenderEnum } from "./enums"
import { ICity, IEyeColor, IHairColor, ILanguage } from "./relevantTypes"

// * REQUEST для формирования запроса
// * RESPONSE для парсинга входящих данных

// ================================ REQUEST ================================
export interface CreateActorType {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    height: number;
    skills: string[];
    
    employeeId: number;
    eyeColor: IEyeColor;
    hairColor: IHairColor;
    city: ICity;
    languages: ILanguage[];
    
    middleName?: string;
    videoURL?: string;
    description?: string;
    education?: string;
    linkToKinoTeatr?: string;
    linkToFilmTools?: string;
    linkToKinopoisk?: string;
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
    videoURL?: string;
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
    gender: string;
    dateOfBirth: Date;
    height: number;
    directory: string;
    url: string;
    employee: IEmployee;
    hairColor: IHairColor;
    eyeColor: IEyeColor;
    city: ICity;
    skills: string[];
    languages: ILanguage[];
    photos: string[];
    createdAt: Date;
    updatedAt: Date;
    
    middleName?: string;
    videoURL?: string;
    description?: string;
    education?: string;
    linkToKinoTeatr?: string;
    linkToFilmTools?: string;
    linkToKinopoisk?: string;
}

export function toIActor(raw: any): IActor {
    return {
        id: Number(raw.id),
        firstName: raw.firstName,
        lastName: raw.lastName,
        gender: raw.gender,
        dateOfBirth: new Date(raw.dateOfBirth),
        height: raw.height,
        directory: raw.directory,
        url: serverURL + "/" + raw.directory,
        employee: raw.employee,
        eyeColor: raw.eyeColor,
        hairColor: raw.hairColor,
        city: raw.city,
        skills: raw.skills,
        languages: raw.languages ?? [],
        photos: raw.photos ?? [],
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),
        
        videoURL: raw.videoURL ?? undefined,
        description: raw.description ?? undefined,
        middleName: raw.middleName ?? undefined,
        education: raw.education ?? undefined,
        linkToKinoTeatr: raw.linkToKinoTeatr ?? undefined,
        linkToFilmTools: raw.linkToFilmTools ?? undefined,
        linkToKinopoisk: raw.linkToKinopoisk ?? undefined
    }
}

export interface IShortActor {
    id: number,
    firstName: string,
    lastName: string,
    directory: string,
    avatarUrl: string
    videoURL?: string
}

export function toIShortActor(raw: any): IShortActor{
    return {
        id: Number(raw.id),
        firstName: raw.firstName,
        lastName: raw.lastName,
        directory: raw.directory,
        avatarUrl: `${serverURL}/${raw.directory}/avatar.jpg`,
        videoURL: raw.videoURL ?? undefined
    }
}
