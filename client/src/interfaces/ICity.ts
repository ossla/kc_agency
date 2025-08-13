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
