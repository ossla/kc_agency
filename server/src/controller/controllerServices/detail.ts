import { Request } from "express"
import { Agent } from "../../entity/agent.entity";
import { appDataSource } from "../../data-source";


export async function getAgent(id: string): Promise<Agent> {
    const agent: Agent | null = await appDataSource
                                            .getRepository(Agent)
                                            .findOne({where: { id }})
    if (!agent) {
        throw new Error("агента с таким id нет")
    }
    
    return agent
}