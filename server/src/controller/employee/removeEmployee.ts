import { NextFunction, Response, Request } from "express"

import { getEmployee } from "./getEmployee"
import { appDataSource } from "../../data-source"
import { Employee } from "../../models/employee.entity"
import { removePhoto } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


export async function removeEmployee(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    const { id } = req.params
    if (!id) {
        throw ApiError.badRequest("укажите корректный id")
    }

    const employee: Employee = await getEmployee(id)
    await removePhoto(employee.photo)
    await appDataSource.getRepository(Employee).delete({ id: employee.id })

    res.status(200).json(true)
} // delete
