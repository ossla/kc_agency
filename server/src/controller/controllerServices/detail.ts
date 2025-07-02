import { Request } from "express"
import { Agent } from "../../entity/agent.entity";
import { appDataSource } from "../../data-source";


export async function getAgent(agentId: string | number): Promise<Agent> {
    const id: number = Number(agentId)
    if (isNaN(id)) {
        throw new Error("Ошибка при получении id")
    }

    const agent: Agent | null = await appDataSource
                                            .getRepository(Agent)
                                            .findOne({where: { id }})
    if (!agent) {
        throw new Error("агента с таким id нет")
    }
    
    return agent
}