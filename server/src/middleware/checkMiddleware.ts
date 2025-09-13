import { Response, NextFunction } from "express"
import { ICustomRequest } from "./authMiddleware"
import processApiError from "../error/processError";

export function checkMiddleware(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json("Unauthorized")
            return;
        }
    
        if (!req.user.isAdmin) {
            res.status(403).json("Недостаточно прав")
            return;
        }
    
        next()
        
    } catch (error) {
        processApiError(error, next)
    }
}