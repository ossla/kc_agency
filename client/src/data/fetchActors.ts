import { IActor, toIActor } from "../model/IActor"

class fetchActors {
    static async getActors(): Promise<IActor[]> {
        const response = await fetch('http://localhost:3001/api/actor/')
        const data = await response.json()
        console.log(data);
        const actors: IActor[] = data.map(toIActor)
        return actors
    }
}

export default fetchActors