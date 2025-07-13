import { ICity } from "./ICity"
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
    directory: string,
    link_to_kino_teatr?: string,
    link_to_film_tools?: string,
    link_to_kinopoisk?: string,
    video?: string,
    agent: string,
    eye_color?: string,
    city?: ICity,
    languages?: ILanguage,
    createdAt: Date
    updatedAt: Date
}