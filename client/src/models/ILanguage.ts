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
