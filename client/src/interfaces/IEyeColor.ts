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
