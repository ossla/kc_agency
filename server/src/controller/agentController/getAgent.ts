import { Request, Response, NextFunction } from "express"
import { instanceToPlain } from "class-transformer" 

import processApiError from "../../error/processError"
import { Agent } from "../../entity/agent.entity"
import { appDataSource } from "../../data-source"


export async function getAgent(id: number): Promise<Agent> {
    const agent: Agent | null = await appDataSource
                                            .getRepository(Agent)
                                            .findOne({where: { id }})
    if (!agent) {
        throw new Error("агента с таким id нет")
    }

    return agent
}

export async function getOne(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.params
        const agent = await getAgent(Number(id))
        
        res.status(200).json(instanceToPlain(agent)) // @exclude hash password поле
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function getAll(req: Request, res: Response, next: NextFunction) 
                                                    : Promise<void> {
    try {
        const agents: Agent[] = await appDataSource.getRepository(Agent).find()
        res.status(200).json(instanceToPlain(agents)) // @exclude hash password поле
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}