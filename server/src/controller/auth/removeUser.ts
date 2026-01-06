import { NextFunction, Response, Request } from "express"
import { appDataSource } from "../../data-source"
import { User } from "../../models/user.entity"
import ApiError from "../../error/apiError"


export async function removeUser(req: Request, res: Response, next: NextFunction)
                                                        : Promise<void> {
    const { id } = req.body
    if (!id) {
        throw ApiError.badRequest("укажите корректный id")
    }
    const user: User = await appDataSource.getRepository(User).findOneBy({id})
    await appDataSource.getRepository(User).delete({ id: user.id })

    res.status(200).json(true)
} // delete
