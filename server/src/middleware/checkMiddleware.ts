import { Response, NextFunction } from "express"
import { ICustomRequest } from "./authMiddleware"
import ApiError from "../error/apiError";


export function checkAdminMiddleware(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
        res.status(401).json("Unauthorized")
        return;
    }

    if (!req.user.isAdmin) {
        res.status(403).json("Недостаточно прав")
        return;
    }

    next()
}