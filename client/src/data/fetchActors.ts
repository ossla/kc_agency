import { IActor, toIActor } from "../models/IActor"
import { IShortActor, toIShortActor } from "../models/IShortActor";
import { GenderEnum } from "../types/enums";

class fetchActors {
    static async getShort(gender: GenderEnum): Promise<IShortActor[]> {
        let sex: string = "woman"
        if (gender === GenderEnum.man) {
            sex = "men"
        }
        
        const response = await fetch(`http://localhost:3001/api/actor/get/${sex}`)
        const data = await response.json()
        
        console.log(data);
        const actors: IShortActor[] = data.map(toIShortActor)
        return actors
    }
}

export default fetchActors