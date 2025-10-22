import { NextFunction, Request, Response } from "express"
import { Jwt, JwtPayload } from 'jsonwebtoken'
import ApiError from "../error/apiError"
import processApiError from "../error/processError"
import { IJwtAccessPayload, verifyAccessToken } from "../controller/auth/jwt"


export interface ICustomRequest extends Request {
    user?: IJwtAccessPayload
}

export function authMiddleware (req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
        next()
        return;
    }

    try {        
        const token: string | undefined = req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            throw new ApiError(401, "Unauthorized")
        }

        const decoded: JwtPayload | string = verifyAccessToken(token)
        if (typeof decoded !== "object" || decoded === null) {
            res.status(403).json("Неверно указан access токен")
        }
        
        
        const user = decoded as JwtPayload & IJwtAccessPayload 
        
        if (!user.id || !user.email || !user.name || user.isAdmin === undefined) {
            res.status(403).json("Неверно указан access токен")
        }

        (req as ICustomRequest).user = user

        next()

    } catch (error: unknown) {
        processApiError(error, next)
    }
}
