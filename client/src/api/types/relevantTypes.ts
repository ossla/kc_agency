
// Типы для api хранятся в данном файле:
// * REQUEST для формирования запроса
// * RESPONSE для парсинга входящих данных

// ================================ REQUEST ================================

// ================================ RESPONSE ================================
export interface ICity {
    id: number,
    name: string
}
export function toICity(raw: any): ICity{
    return {
        id: raw.id,
        name: raw.name
    }
}


export interface IEyeColor {
    id: number,
    name: string
}
export function toIEyeColor(raw: any): IEyeColor{
    return {
        id: raw.id,
        name: raw.name
    }
}


export interface ILanguage {
    id: number,
    name: string
}
export function toILanguage(raw: any): ILanguage{
    return {
        id: raw.id,
        name: raw.name
    }
}
