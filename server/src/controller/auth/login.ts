import { Request, Response, NextFunction } from "express"
import * as bcrypt from "bcrypt"

import { appDataSource } from "../../data-source"
import processApiError from "../../error/processError"
import { createTokens, hashToken, IJwtAccessPayload, IJwtRefreshPayload, signAccessToken, signRefreshToken, TokenPair } from "./jwt"
import { User } from "../../models/user.entity"
import ApiError from "../../error/apiError"
import { COOKIE_NAME, REFRESH_TOKEN_EXPIRES_MS, refreshRepo } from "./config"
import { RefreshToken } from "../../models/refreshToken.entity"



export async function login(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        // получение данных
        const { email, password } = req.body
        if (!email || !password) throw new ApiError(400, 'Нужно заполнить все поля')
        // идентификация
        const user = await appDataSource.getRepository(User).findOneBy({
            email: email
        })
        if (!user) throw new Error('Пользователя с таким email не существует')
        // проверка пароля
        const valid: boolean = bcrypt.compareSync(password, user.hashPassword)
        if (!valid) throw new Error('Неверный пароль')

        // создание токена
        const tokens: TokenPair = await createTokens(user)

        res.cookie(COOKIE_NAME, tokens.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: REFRESH_TOKEN_EXPIRES_MS
        })

        res.json({ accessToken: tokens.access, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } })

    } catch (error: unknown) {
        processApiError(error, next)
    }
}