import { Request, Response, NextFunction } from "express"
import * as bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { Agent } from "../../entity/agent.entity"
import { appDataSource } from "../../data-source"
import processApiError from "../../error/processError"
import { IJwtPayload } from "../services/types"
import { ICustomRequest } from "../../middleware/checkMiddleware"


export async function createToken(id: number, name: string, email: string, isAdmin: boolean): Promise<string> {
    const secretKey = process.env.SECRETKEY as string | undefined;
    if (!secretKey) {
        throw new Error('Secret key is not defined');
    }
    return jwt.sign(
        {
            id,
            name,
            email,
            isAdmin
        },
        secretKey,
        {expiresIn: '10 days'}
    )
}

export async function login(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        // получение данных
        const { email, password } = req.body
        if (!email || !password) throw new Error('Нужно заполнить все поля')
        // идентификация
        const agent = await appDataSource.getRepository(Agent).findOneBy({
            email: email
        })
        if (!agent) throw new Error('Пользователя с таким email не существует')
        // проверка пароля на валидность
        const valid: boolean = bcrypt.compareSync(password, agent.hashPassword)
        if (!valid) throw new Error('Неверный пароль')
        // создание токена
        const token = await createToken(agent.id, agent.firstName, agent.email, true)
        res.json(token)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function auth(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
    const agent = req.agent as IJwtPayload;
    const agentId = agent.id;
    const agentName = agent.name;
    const agentEmail = agent.email;
    const agentIsAdmin = agent.isAdmin;
    const token = await createToken(agentId, agentName, agentEmail, agentIsAdmin)
    res.json(token)
}

