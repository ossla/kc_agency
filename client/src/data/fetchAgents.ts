import { IAgent, IShortAgent, toIAgent, toIShortAgent } from "../models/IAgent";
import { GenderEnum } from "../types/enums";

class fetchAgents {
    static async getShort(): Promise<IShortAgent[]> {
        
        const response = await fetch(`http://localhost:3001/api/agent/`)
        const data = await response.json()
        console.log(data[0]);
        
        
        const agents: IShortAgent[] = data.map(toIShortAgent)
        return agents
    }

    static async getAgent(id: number): Promise<IAgent> {
        
        const response = await fetch(`http://localhost:3001/api/agent/${id}`)
        const data = await response.json()

        console.log(data)
        return toIAgent(data)
    }
}

export default fetchAgents