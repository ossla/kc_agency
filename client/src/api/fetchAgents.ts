import { ResponseHandler, ResponseHandlerMap } from "./ResponseHandler";
import { IAgent, IShortAgent, toIAgent, toIShortAgent } from "./types/agentTypes";
import { GenderEnum } from "./types/enums";

class fetchAgents {
    // ================== CREATE ==================
    static async create(accessToken: string, reqFormData: FormData): Promise<IAgent> {
        const response = await fetch(`http://localhost:3001/api/agent/create`, {
            method: "POST",
            body: reqFormData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })
        const agent: IAgent = await ResponseHandler<IAgent>(response, toIAgent)
        return agent
    }
    // ================== EDIT ==================
    // ================== DELETE ==================
    // ================== GET ==================
    static async getShort(): Promise<IShortAgent[]> {
        
        const response = await fetch(`http://localhost:3001/api/agent/`, {method: "GET"})
        const agents: IShortAgent[] = await ResponseHandlerMap<IShortAgent>(response, toIShortAgent)
        return agents
    }

    static async getAgent(id: number): Promise<IAgent> {

        const response = await fetch(`http://localhost:3001/api/agent/${id}`, {method: "GET"})
        const agent: IAgent = await ResponseHandler<IAgent>(response, toIAgent)
        return agent
    }
}

export default fetchAgents