import { Request, Response, NextFunction } from "express"

import { getAgent } from "../fs_functions/getService"
import processApiError from "../../error/processError"
import { Agent } from "../../entity/agent.entity"
import { appDataSource } from "../../data-source"


export async function getOne(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.params
        const agent = await getAgent(id)
        
        res.status(200).json(agent)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
} // getOne

export async function getAll(req: Request, res: Response, next: NextFunction) 
                                                    : Promise<void> {
    try {
        const agents: Agent[] = await appDataSource.getRepository(Agent).find()
        res.status(200).json(agents)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
} // getAll