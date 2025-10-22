import { NextFunction, Response } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { createTokens, hashToken, IJwtAccessPayload, IJwtRefreshPayload, refreshRepo, TokenPair, verifyRefreshToken } from "./jwt"
import { COOKIE_NAME, REFRESH_TOKEN_EXPIRES_MS } from "./config"
import processApiError from "../../error/processError"
import ApiError from "../../error/apiError"
import { IAuthorized, IUser } from "./authTypes"


export async function auth(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        
        const token = req.cookies[COOKIE_NAME]
        if (!token) {
            throw new ApiError(401, "refresh токен не найден");
        }

        let payload: IJwtRefreshPayload
        try {
            payload = verifyRefreshToken(token) as IJwtRefreshPayload
        } catch (err) {
            throw new ApiError(401, "неверный refresh токен");
        }

        const tokenHash = hashToken(token)
        const stored = await refreshRepo().findOne({ where: { tokenHash }, relations: ["user"] })
        if (!stored || stored.expiresAt < new Date()) {
            throw new ApiError(401, "неверный refresh токен")
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

        const userResp: IUser = { id: stored.user.id, email: stored.user.email, name: stored.user.name, isAdmin: stored.user.isAdmin }
        const resp: IAuthorized = { accessToken: tokens.access, user: userResp }
        res.status(201).json(resp)

    } catch (error: unknown) {
        processApiError(error, next)   
    }
}