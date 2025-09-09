import { Request, Response, NextFunction } from "express"
import * as bcrypt from "bcrypt"
import { z } from "zod"

import { appDataSource } from "../../data-source"
import processApiError from "../../error/processError"
import { User } from "../../models/user.entity"
import ApiError from "../../error/apiError"
import { SALT_ROUNDS } from "./config"


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

        const user: User = new User()
        user.hashPassword = await bcrypt.hash(regbody.password, SALT_ROUNDS)
        user.name = regbody.name
        user.email = regbody.email
        await appDataSource.getRepository(User).save(user)

        res.status(201).json({ id: user.id, email: user.email });
        
    } catch (error: unknown) {
        processApiError(error, next)
    }
}