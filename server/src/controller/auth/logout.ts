import { Request, Response, NextFunction } from "express"

import { hashToken, refreshRepo } from "./jwt"
import { COOKIE_NAME } from "./config"


export async function logout(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const token = req.cookies[COOKIE_NAME]
    if (token) {
        const tokenHash = hashToken(token)
        const stored = await refreshRepo().findOne({ where: { tokenHash }})
        if (stored) {
            await refreshRepo().delete(stored)
        }
    }
    res.clearCookie(COOKIE_NAME, { path: "/" })
    res.status(200).json(true)
}