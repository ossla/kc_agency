import { Request, Response, NextFunction } from "express"
import * as bcrypt from "bcrypt"

import { Agent } from "../../entity/agent.entity"
import { appDataSource } from "../../data-source"
import { createToken } from "./services/jwtserv"
import processApiError from "../../error/processError"
import { IJwtPayload } from "./services/types"
import { ICustomRequest } from "../../middleware/checkMiddleware"


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
        const valid: boolean = bcrypt.compareSync(password, agent.hash_password)
        if (!valid) throw new Error('Неверный пароль')
        // создание токена
        const token = await createToken(agent.id, agent.first_name, agent.email, true)
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
    const agentIsAdmin = agent.is_admin;
    const token = await createToken(agentId, agentName, agentEmail, agentIsAdmin)
    res.json(token)
}
