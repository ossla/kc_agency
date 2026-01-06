import { Request, Response, NextFunction } from "express"
import { instanceToPlain } from "class-transformer" 

import { appDataSource } from "../../data-source"
import ApiError from "../../error/apiError"
import { User } from "../../models/user.entity"
import { ICustomRequest } from "../../middleware/authMiddleware"

export async function getUr(userId: string): Promise<User> {
    const user = await appDataSource.getRepository(User).findOne({
                    where: { id: userId }
                    , relations: ["favorites", "favorites.actor"]
                })

    if (!user) {
        throw ApiError.badRequest( "не найден пользователь")
    }
    return user
}

export async function getUser(req: ICustomRequest, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    const { id } = req.params

    if (!id) {
        throw ApiError.badRequest("укажите корректный id")
    }
    if (id != req.user.id) {
        throw ApiError.badRequest( "Вы не можете просматривать профиль другого пользователя")
    }
    const user: User = await getUr(id)
    
    res.status(200).json(instanceToPlain(user)) // @exclude hash password поле
}