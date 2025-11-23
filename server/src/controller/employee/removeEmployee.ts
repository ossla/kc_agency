import { NextFunction, Response, Request } from "express"

import { getEmployee } from "./getEmployee"
import { appDataSource } from "../../data-source"
import { Employee } from "../../models/employee.entity"
import processApiError from "../../error/processError"
import { removePhoto } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


export async function removeEmployee(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.params
        const idNum = Number(id)
        if (!id || !Number.isInteger(idNum)) {
            throw new ApiError(400, "укажите корректный id")
        }

        const employee: Employee = await getEmployee(Number(id))
        await removePhoto(employee.photo)
        await appDataSource.getRepository(Employee).delete({ id: employee.id })

        res.status(200).json(true)

    } catch (error: unknown) {
        processApiError(error, next)
    }
} // delete
