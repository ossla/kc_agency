import { NextFunction, Response, Request } from "express"
import { appDataSource } from "../../data-source"
import { User } from "../../models/user.entity"
import processApiError from "../../error/processError"
import ApiError from "../../error/apiError"


export async function removeUser(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.body
        if (!id) {
            throw new ApiError(400, "укажите корректный id")
        }
        const user: User = await appDataSource.getRepository(User).findOneBy({id})
        await appDataSource.getRepository(User).delete({ id: user.id })

        res.status(200).json(true)

    } catch (error: unknown) {
        processApiError(error, next)
    }
} // delete
