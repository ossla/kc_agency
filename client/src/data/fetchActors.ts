import { IActor, toIActor } from "../models/IActor"
import { IShortActor, toIShortActor } from "../models/IActor";
import { GenderEnum } from "../types/enums";

class fetchActors {
    static async getShort(): Promise<IShortActor[]> {
        const response = await fetch(`http://localhost:3001/api/actor/`, {method: "GET"})
        const data = await response.json()

        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }

    static async getShortByGender(gender: GenderEnum): Promise<IShortActor[]> {
        let sex: string = "women"

        const response = await fetch(`http://localhost:3001/api/actor/get/${sex}`, {method: "GET"})
        const data = await response.json()

        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }

    // static async fetchFiltered() {
    //     const res = await fetch("http://localhost:3001/api/actor/filter", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(filters)
    //     })
    //     const data = await response.json()

    // }

    static async getActor(id: number): Promise<IActor> {
        
        const response = await fetch(`http://localhost:3001/api/actor/${id}`, {method: "GET"})
        const data = await response.json()

        return toIActor(data)
    }
}

export default fetchActors