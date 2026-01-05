import { NextFunction, Response, Request } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { appDataSource } from "../../data-source"
import { User } from "../../models/user.entity"
import { Actor } from "../../models/actor.entity"
import ApiError from "../../error/apiError"
import { Favorite } from "../../models/favorite.entity"
import processApiError from "../../error/processError"
import { getUr } from "./getUser"


async function getActor(actorId: string): Promise<Actor> {
    const actor = await appDataSource.getRepository(Actor).findOne({ where: { id: actorId }})
    if (!actor) {
        throw new ApiError(404, "не найден пользователь")
    }
    return actor
}

export async function addFavorite(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        const { userId, actorId } = req.params
        if (!userId || !actorId) {
            throw new ApiError(400, "необходимо указать userId & actorId")
        }
        if (userId != req.user.id) {
            throw new ApiError(403, "Доступ к панели избранного другого пользователя запрещён")
        }

        const user = await getUr(userId)
        const actor = await getActor(actorId)

        const exist = await appDataSource.getRepository(Favorite).findOneBy({ 
            user: { id: userId },
            actor: { id: actorId }
        })
        console.log(exist);
        if (exist) {
            throw new ApiError(400, "Bad request: Актёр уже добавлен в избранное. Логика клиента нарушена")
        }

        const favorite: Favorite = new Favorite()
        favorite.actor = actor
        favorite.user = user
        await appDataSource.getRepository(Favorite).save(favorite)

        res.status(201).json({message: `актёр ${favorite.actor.id} добавлен пользователю ${favorite.user.id}`})

    } catch (error: unknown) {
        processApiError(error, next)   
    }
}

export async function removeFavorite(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { userId, actorId } = req.params
        if (!userId || !actorId) {
            throw new ApiError(400, "необходимо указать userId & actorId")
        }
        if (userId != req.user.id) {
            throw new ApiError(403, "Доступ к панели избранного другого пользователя запрещён")
        }

        const _ = await getUr(userId)
        const __ = await getActor(actorId)

        await appDataSource.getRepository(Favorite).delete({
            user: { id: userId },
            actor: { id: actorId }
        })

        res.status(200).json(true)

    } catch (error: unknown) {
        processApiError(error, next)
    }
}

export async function getFavorites(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        const { userId } = req.params
        if (!userId) {
            throw new ApiError(400, "необходимо указать userId")
        }
        if (userId != req.user.id) {
            throw new ApiError(403, "Доступ к панели избранного другого пользователя запрещён")
        }

        const user = await getUr(userId)

        res.status(200).json(
            user.favorites.map((fav) => ({
                id: fav.actor.id,
                firstName: fav.actor.firstName,
                lastName: fav.actor.lastName,
                directory: fav.actor.directory
            }))
        )

    } catch (error: unknown) {
        processApiError(error, next)
    }
}