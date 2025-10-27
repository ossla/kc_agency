import { NextFunction, Response, Request } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { appDataSource } from "../../data-source"
import { User } from "../../models/user.entity"
import { Actor } from "../../models/actor.entity"
import ApiError from "../../error/apiError"
import { Favorite } from "../../models/favorite.entity"
import processApiError from "../../error/processError"
import { getUr } from "./getUser"


function checkIdentificators(param1?: string, param2?: string): void {
    if (!param1 || !param2) {
        throw new ApiError(400, "необходимо указать userId & actorId")
    }

    if (isNaN(Number(param1)) || isNaN(Number(param2))) {
        throw new ApiError(400, "userId & actorId должны быть числами")
    }
}

async function getActor(actorId: number): Promise<Actor> {
    const actor = await appDataSource.getRepository(Actor).findOne({ where: { id: Number(actorId) }})
    if (!actor) {
        throw new ApiError(404, "не найден пользователь")
    }
    return actor
}

export async function addFavorite(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
        const { userId, actorId } = req.params
        checkIdentificators(userId, actorId)
        if (Number(userId) != req.user.id) {
            throw new ApiError(403, "Доступ к панели избранного другого пользователя запрещён")
        }

        const user = await getUr(Number(userId))
        const actor = await getActor(Number(actorId))

        const exist = await appDataSource.getRepository(Favorite).findOneBy({ 
            user: { id: Number(userId) },
            actor: { id: Number(actorId) }
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
        checkIdentificators(userId, actorId)
        if (Number(userId) != req.user.id) {
            throw new ApiError(403, "Доступ к панели избранного другого пользователя запрещён")
        }

        const _ = await getUr(Number(userId))
        const __ = await getActor(Number(actorId))

        await appDataSource.getRepository(Favorite).delete({
            user: { id: Number(userId) },
            actor: { id: Number(actorId) }
        })

        res.status(200).json(true)

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

        const user = await getUr(Number(userId))

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