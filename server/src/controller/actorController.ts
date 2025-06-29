import { NextFunction, Request, Response } from "express"

import processApiError from "../error/processError";


class actorController {
    async create(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // create

    async delete(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try { // journalId
            

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // delete

    async getOne(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {

            
        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // getOne

    async getAll(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {

            
        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    } // getAll
} // actorController

export default actorController