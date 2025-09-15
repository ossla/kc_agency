import { Request, Response, NextFunction } from "express"
import { instanceToPlain } from "class-transformer" 

import processApiError from "../../error/processError"
import { appDataSource } from "../../data-source"
import ApiError from "../../error/apiError"
import { User } from "../../models/user.entity"
import { ICustomRequest } from "../../middleware/authMiddleware"


export async function getUser(req: ICustomRequest, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.params
        const idNum = Number(id)

        if (!id || !Number.isInteger(idNum)) {
            throw new ApiError(400, "укажите корректный id")
        }
        if (Number(id) != req.user.id) {
            throw new ApiError(400, "Вы не можете просматривать профиль другого пользователя")
        }
        const user: User | null = await appDataSource
                                            .getRepository(User)
                                            .findOne({where: { id: Number(id) }, relations: ["favorites"]})
        if (!user) {
            throw new ApiError(401, "пользователя с таким id нет")
        }
        
        res.status(200).json(instanceToPlain(user)) // @exclude hash password поле

    } catch (error: unknown) {
        processApiError(error, next)
    }
}