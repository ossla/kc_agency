import { NextFunction, Response, Request } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { appDataSource } from "../../data-source"
import { User } from "../../models/user.entity"
import { Actor } from "../../models/actor.entity"
import ApiError from "../../error/apiError"
import { Favorite } from "../../models/favorite.entity"
import processApiError from "../../error/processError"


function checkIdentificators(param1?: string, param2?: string): void {
    if (!param1 || !param2) {
        throw new ApiError(400, "необходимо указать userId & actorId")
    }

    if (isNaN(Number(param1)) || isNaN(Number(param2))) {
        throw new ApiError(400, "userId & actorId должны быть числами")
    }
}

async function getUser(userId: number): Promise<User> {
    const user = await appDataSource.getRepository(User).findOne({ where: { id: Number(userId) }, relations: ["favorites"] })
    if (!user) {
        throw new ApiError(404, "не найден пользователь")
    }
    return user
}

export async function addFavorite(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        const { userId, actorId } = req.params
        checkIdentificators(userId, actorId)
        if (Number(userId) != req.user.id) {
            throw new ApiError(403, "Доступ к панели избранного другого пользователя запрещён")
        }

        const user = await getUser(Number(userId))
        const actor = await appDataSource.getRepository(Actor).findOneBy({ id: Number(actorId) })
        if (!actor) {
            throw new ApiError(404, "не найден актёр")
        } 

        const favorite: Favorite = new Favorite()
        favorite.actor = actor
        favorite.user = user
        await appDataSource.getRepository(Favorite).save(favorite)

        res.status(201).json(favorite)

    } catch (error: unknown) {
        processApiError(error, next)   
    }
}

export async function removeFavorite(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        const { userId, actorId } = req.params
        checkIdentificators(userId, actorId)
        if (Number(userId) != req.user.id) {
            throw new ApiError(403, "Доступ к панели избранного другого пользователя запрещён")
        }

        const user = await getUser(Number(userId))
        
        user.favorites = user.favorites.filter(actor => actor.id !== Number(actorId))
        await appDataSource.getRepository(User).save(user)

        res.status(200).json(user.favorites)
    } catch (error: unknown) {
        processApiError(error, next)
    }
}

export async function getFavorites(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        const { userId } = req.params
        if (!userId || isNaN(Number(userId))) {
            throw new ApiError(400, "необходимо указать userId (в формате числа)")
        }
        if (Number(userId) != req.user.id) {
            throw new ApiError(403, "Доступ к панели избранного другого пользователя запрещён")
        }

        const user = await getUser(Number(userId))

        res.status(200).json(user.favorites)
    } catch (error: unknown) {
        processApiError(error, next)
    }
}