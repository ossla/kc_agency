import { GenderEnum } from "./enums"

export interface CreateActorType {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    agentId: number;
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
    agentId?: number;
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
    agentId?: number;
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
