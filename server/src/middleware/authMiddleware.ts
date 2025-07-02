import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';


export interface ICustomRequest extends Request {
    user: string | JwtPayload;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') next()
    try {
        const token: string | undefined = req.header('authorization')?.replace('Bearer ', '')

        if (!token) { res.status(401).json({message: 'не авторизован'}) }
        else {
            const secretKey = process.env.SECRETKEY as string | undefined
            if (!secretKey) {
                throw new Error('SECRET KEY не найден')
            }
            const decoded: string | JwtPayload = jwt.verify(token, secretKey as Secret);

            
            (req as ICustomRequest).user = decoded
            next()
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.json({message: 'auth middleware: ' + error.message})
        } else if (typeof error === 'string') {
            res.json({ message: error })
        }
    }
}
