import { Request, Response } from "express"
import { appDataSource } from "../../data-source"
import { Actor } from "../../models/actor.entity"
import ApiError from "../../error/apiError"

export async function reorderActors(req: Request, res: Response) {
    const { gender, ids, originalIds } = req.body
    if (!['M', 'W'].includes(gender) || !Array.isArray(ids) || !Array.isArray(originalIds) ||
        !ids.every(id => typeof id === 'string') || new Set(ids).size !== ids.length) {
        throw ApiError.badRequest("Некорректный порядок актёров")
    }
    await appDataSource.transaction(async manager => {
        // Serialize changes, including concurrent additions/removals and gender changes.
        await manager.query('LOCK TABLE "actor" IN SHARE ROW EXCLUSIVE MODE')
        const current = await manager.createQueryBuilder(Actor, 'actor')
            .where('actor.gender = :gender', { gender }).orderBy('actor.sortOrder', 'ASC')
            .addOrderBy('LOWER(actor.lastName)', 'ASC').addOrderBy('actor.id', 'ASC').getMany()
        const expected = current.map(actor => actor.id)
        if (JSON.stringify(originalIds) !== JSON.stringify(expected) || ids.length !== expected.length ||
            !expected.every(id => ids.includes(id))) {
            throw ApiError.badRequest("Список уже изменился. Закройте редактор и откройте его заново")
        }
        for (let index = 0; index < ids.length; index++) {
            await manager.update(Actor, ids[index], { sortOrder: index })
        }
    })
    res.json(true)
}
