import { Request, Response, NextFunction } from "express"
import { instanceToPlain } from "class-transformer" 

import processApiError from "../../error/processError"
import { appDataSource } from "../../data-source"
import ApiError from "../../error/apiError"
import { User } from "../../models/user.entity"
import { ICustomRequest } from "../../middleware/authMiddleware"

export async function getUr(userId: number): Promise<User> {
    const user = await appDataSource.getRepository(User).findOne({
                    where: { id: Number(userId) }
                    , relations: ["favorites", "favorites.actor"]
                })

    if (!user) {
        throw new ApiError(404, "не найден пользователь")
    }
    return user
}

export async function getUser(req: ICustomRequest, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.params
        const idNum = Number(id)

        if (!id || !Number.isInteger(idNum)) {
            throw new ApiError(400, "укажите корректный id")
        }
        if (idNum != req.user.id) {
            throw new ApiError(400, "Вы не можете просматривать профиль другого пользователя")
        }
        const user: User = await getUr(idNum)
        
        res.status(200).json(instanceToPlain(user)) // @exclude hash password поле

    } catch (error: unknown) {
        processApiError(error, next)
    }
}