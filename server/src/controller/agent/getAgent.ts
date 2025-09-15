import { Request, Response, NextFunction } from "express"
import { instanceToPlain } from "class-transformer" 

import processApiError from "../../error/processError"
import { Agent } from "../../models/agent.entity"
import { appDataSource } from "../../data-source"
import ApiError from "../../error/apiError"


export async function getAgent(id: number): Promise<Agent> {
    const agent: Agent | null = await appDataSource
                                            .getRepository(Agent)
                                            .findOne({where: { id }})
    if (!agent) {
        throw new ApiError(401, "агента с таким id нет")
    }

    return agent
}

export async function getOneAgent(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.params
        if (!id || isNaN(Number(id))) {
            throw new ApiError(400, "укажите корректный id")
        }
        const agent: Agent = await getAgent(Number(id))
        
        res.status(200).json(instanceToPlain(agent)) // @exclude hash password поле

    } catch (error: unknown) {
        processApiError(error, next)
    }
}

export async function getAllAgents(req: Request, res: Response, next: NextFunction) 
                                                    : Promise<void> {
    try {
        const agents: Agent[] = await appDataSource.getRepository(Agent).find()
        res.status(200).json(instanceToPlain(agents))

    } catch (error: unknown) {
        processApiError(error, next)
    }
}

export async function getShortAgents(req: Request, res: Response, next: NextFunction) 
                                                    : Promise<void> {
    try {
        const actors = await appDataSource.getRepository(Agent)
            .createQueryBuilder("agent")
            .select(["agent.id", "agent.firstName", "agent.lastName", "agent.photo"])
            .getMany()

        res.json(actors);

    } catch (error: unknown) {
        processApiError(error, next)
    }
}
