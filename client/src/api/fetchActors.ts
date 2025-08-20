import { IActor, toIActor } from "../interfaces/IActor"
import { IShortActor, toIShortActor } from "../interfaces/IActor";
import { FilterActorType } from "../types/actorTypes";
import { GenderEnum } from "../types/enums";
import { filterActorsURL, getActorsURL, getMenActorsURL, getWomenActorsURL } from "./server_url";


class fetchActors {
    static async getShort(): Promise<IShortActor[]> {
        const response = await fetch(getActorsURL, {method: "GET"})
        const data = await response.json()

        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }

    static async getShortByGender(gender: GenderEnum): Promise<IShortActor[]> {
        const response = await fetch(
                    gender === GenderEnum.man ? getMenActorsURL : getWomenActorsURL
                    , {method: "GET"})
        const data = await response.json()

        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }

    static async getActor(id: number): Promise<IActor> {        
        const response = await fetch(`${getActorsURL}/${id}`, {method: "GET"})
        const data = await response.json()

        return toIActor(data)
    }

    static async filterActor(filters: FilterActorType): Promise<IShortActor[]> {
      
        // убирает поля, значения которых null
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([k, v]) => v != null)
        )
        
        // гарантия того, что будут отправляться именно массивы с клиента 
        if (cleanedFilters.cityIds && typeof cleanedFilters.cityIds === "string") {
            cleanedFilters.cityIds = cleanedFilters.cityIds.split(",").map(Number);
        }
        if (cleanedFilters.eyeIds && typeof cleanedFilters.eyeIds === "string") {
            cleanedFilters.eyeIds = cleanedFilters.eyeIds.split(",").map(Number);
        }
        if (cleanedFilters.languageIds && typeof cleanedFilters.languageIds === "string") {
            cleanedFilters.languageIds = cleanedFilters.languageIds.split(",").map(Number);
        }

        const response = await fetch(filterActorsURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cleanedFilters)
        })
        const data = await response.json()

        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }
}

export default fetchActors