import { Request, Response, NextFunction } from "express"
import * as bcrypt from "bcrypt"
import { z } from "zod"

import { appDataSource } from "../../data-source"
import processApiError from "../../error/processError"
import { User } from "../../models/user.entity"
import ApiError from "../../error/apiError"
import { COOKIE_NAME, REFRESH_TOKEN_EXPIRES_MS, SALT_ROUNDS } from "./config"
import { createTokens, TokenPair } from "./jwt"
import { IAuthorized, IUser } from "./authTypes"


const RegistrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(7),
})
type IRegistrationBody = z.infer<typeof RegistrationSchema>

export async function registration(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        // получение данных
        const regbody: IRegistrationBody = RegistrationSchema.parse(req.body)

        // идентификация
        const exist = await appDataSource.getRepository(User).findOneBy({
            email: regbody.email
        })
        if (exist) throw new ApiError(400, 'Пользователь с таким email уже существует')

        // сохранение User в БД
        const user: User = new User()
        user.hashPassword = await bcrypt.hash(regbody.password, SALT_ROUNDS)
        user.name = regbody.name
        user.email = regbody.email
        user.isAdmin = false
        await appDataSource.getRepository(User).save(user)
        
        // создание токенов, сохранение refresh
        const tokens: TokenPair = await createTokens(user)
        res.cookie(COOKIE_NAME, tokens.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: REFRESH_TOKEN_EXPIRES_MS
        })

        const userResp: IUser = { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }
        const resp: IAuthorized = { accessToken: tokens.access, user: userResp }
        
        res.status(201).json(resp)

    } catch (error: unknown) {
        processApiError(error, next)
    }
}