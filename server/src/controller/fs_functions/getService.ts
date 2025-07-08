import { Request } from "express"
import { Agent } from "../../entity/agent.entity"
import { appDataSource } from "../../data-source"
import { Actor } from "../../entity/actor.entity"


export async function getAgent(id: string): Promise<Agent> {
    const agent: Agent | null = await appDataSource
                                            .getRepository(Agent)
                                            .findOne({where: { id }})
    if (!agent) {
        throw new Error("агента с таким id нет")
    }

    return agent
}

export async function getActor(id: string): Promise<Actor> {
    const actor: Actor | null = await appDataSource
                                            .getRepository(Actor)
                                            .findOne({where: { id }})
    if (!actor) {
        throw new Error("актера с таким id нет")
    }

    return actor
}