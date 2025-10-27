import { ResponseHandler, ResponseHandlerMap } from "./ResponseHandler";
import { FilterActorType, IActor, IShortActor, toIActor, toIShortActor } from "./types/actorTypes";
import { GenderEnum } from "./types/enums";
import { filterActorsURL, getActorsURL, getMenActorsURL, getWomenActorsURL } from "./URLs";


class fetchActors {
    // ================== CREATE ==================
    // ================== EDIT ==================
    // ================== DELETE ==================
    // ================== GET ==================
    static async getShort(): Promise<IShortActor[]> {
        const response = await fetch(getActorsURL, {method: "GET"})

        const actors: IShortActor[] = await ResponseHandlerMap<IShortActor>(response, toIShortActor)
        return actors
    }

    static async getShortByGender(gender: GenderEnum): Promise<IShortActor[]> {
        const response = await fetch(
                    gender === GenderEnum.man ? getMenActorsURL : getWomenActorsURL
                    , {method: "GET"})
        const actors: IShortActor[] = await ResponseHandlerMap<IShortActor>(response, toIShortActor)
        return actors
    }

    static async getActor(id: number): Promise<IActor> {        
        const response = await fetch(`${getActorsURL}/${id}`, {method: "GET"})
        const actor: IActor = await ResponseHandler<IActor>(response, toIActor)
        return actor
    }

    static async filterActor(filters: FilterActorType): Promise<IShortActor[]> {
      
        // убирает невыбранные фильтры (поля null)
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([k, v]) => v != null)
        )
        
        // гарантия того, что будут отправляться именно массивы айди из таблиц (city, eye, etc.) с клиента
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

        const actors: IShortActor[] = await ResponseHandlerMap<IShortActor>(response, toIShortActor)
        return actors
    }
}

export default fetchActors