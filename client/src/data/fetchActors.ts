import { IActor, toIActor } from "../models/IActor"
import { IShortActor, toIShortActor } from "../models/IActor";
import { GenderEnum } from "../types/enums";
import { ActorURL, getShortActorURL, getShortMenActorURL, getShortWomenActorURL } from "./routes";


class fetchActors {
    static async getShort(): Promise<IShortActor[]> {
        const response = await fetch(getShortActorURL, {method: "GET"})
        const data = await response.json()

        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }

    static async getShortByGender(gender: GenderEnum): Promise<IShortActor[]> {
        const response = await fetch(
                    gender === GenderEnum.man ? getShortMenActorURL : getShortWomenActorURL
                    , {method: "GET"})
        const data = await response.json()

        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }

    static async getActor(id: number): Promise<IActor> {        
        const response = await fetch(`${ActorURL}/${id}`, {method: "GET"})
        const data = await response.json()

        return toIActor(data)
    }

    static async filterActor(): Promise<IShortActor[]> {
        return []
    }
}

export default fetchActors