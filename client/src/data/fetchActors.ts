import { IActor, toIActor } from "../models/IActor"
import { IShortActor, toIShortActor } from "../models/IActor";
import { GenderEnum } from "../types/enums";

class fetchActors {
    static async getShort(gender: GenderEnum): Promise<IShortActor[]> {
        let sex: string = "women"
        if (gender === GenderEnum.man) {
            sex = "men"
        }
        
        const response = await fetch(`http://localhost:3001/api/actor/get/${sex}`)
        const data = await response.json()
        
        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }

    static async getActor(id: number): Promise<IActor> {
        
        const response = await fetch(`http://localhost:3001/api/actor/${id}`)
        const data = await response.json()

        console.log(data)
        return toIActor(data)
    }
}

export default fetchActors