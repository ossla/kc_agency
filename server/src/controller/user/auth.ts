import { NextFunction, Response } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { createTokens, hashToken, refreshRepo, TokenPair, verifyRefreshToken } from "./jwt"
import { COOKIE_NAME, REFRESH_TOKEN_EXPIRES_MS } from "./config"
import processApiError from "../../error/processError"
import ApiError from "../../error/apiError"


export async function auth(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        
    const token = req.cookies[COOKIE_NAME]
    if (!token) {
        throw new ApiError(401, "refresh токен не найден");
    }

    let payload: any
    try {
        payload = verifyRefreshToken(token) as any
    } catch (err) {
        throw new ApiError(401, "неверный refresh токен");
    }

    const tokenHash = hashToken(token)
    const stored = await refreshRepo().findOne({ where: { tokenHash }, relations: ["user"] })
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
        throw new ApiError(401, "неверный refresh токен");
    }

    // ротация
    const tokens: TokenPair = await createTokens(stored.user, stored)

    res.cookie(COOKIE_NAME, tokens.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: REFRESH_TOKEN_EXPIRES_MS
    })

    res.json({ accessToken: tokens.access, 
        user: { id: stored.user.id, email: stored.user.email, isAdmin: stored.user.isAdmin } })

    } catch (error: unknown) {
        processApiError(error, next)   
    }
}