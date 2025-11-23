import { Request, Response, NextFunction } from "express"
import * as fs from "fs"

import { appDataSource } from "../../data-source"
import { getEmployee } from "./getEmployee"
import { Employee } from "../../models/employee.entity"
import processApiError from "../../error/processError"
import { changePhoto, CustomFileType } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


interface IName {
    first?: string,
    last?: string,
    middle?: string
}
function setName(employee: Employee, name: IName) {
    if (name.first) {
        employee.firstName = name.first
    }
    if (name.last) {
        employee.lastName = name.last
    }
    if (name.middle) {
        employee.middleName = name.middle
    }
}

function setEmployeeStringField<T extends keyof Employee>(employee: Employee, field: T, value: Employee[T] | undefined) {    
    if (value !== undefined) {
        employee[field] = value
    }
}

export async function editEmployee(req: Request, res: Response, next: NextFunction) {
    try {    
        const { id } = req.body
        const idNum = Number(id)
        if (!id || !Number.isInteger(idNum)) {
            throw new ApiError(400, "укажите корректный id")
        }
        const {
            firstName,
            lastName,
            middleName,
            email,
            phone,
            description,
            telegram,
            vk,
        } = req.body


        let employee: Employee = await getEmployee(Number(id))
        setName(employee, {first: firstName, last: lastName, middle: middleName})
        setEmployeeStringField(employee, "email", email)
        setEmployeeStringField(employee, "phone", phone)
        setEmployeeStringField(employee, "description", description)
        setEmployeeStringField(employee, "telegram", telegram)
        setEmployeeStringField(employee, "vk", vk)

        const newAvatar: CustomFileType = req.files?.newAvatar
        if (newAvatar) {
            await changePhoto(newAvatar, employee.photo)
        }

        await appDataSource.getRepository(Employee).save(employee)
        res.json(employee)
    } catch (error: unknown) {
        processApiError(error, next)
    }
}
