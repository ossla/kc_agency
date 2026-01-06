import { Request, Response, NextFunction } from "express"
import { instanceToPlain } from "class-transformer" 

import { Employee } from "../../models/employee.entity"
import { appDataSource } from "../../data-source"
import ApiError from "../../error/apiError"


export async function getEmployee(id: string): Promise<Employee> {
    const employee: Employee | null = await appDataSource
                                            .getRepository(Employee)
                                            .findOne({where: { id }})
    if (!employee) {
        throw ApiError.badRequest("агента с таким id нет")
    }

    return employee
}

export async function getOneEmployee(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    const { id } = req.params
    if (!id) {
        throw ApiError.badRequest("не указан id")
    }
    const employee: Employee = await getEmployee(id)

    res.status(200).json(instanceToPlain(employee)) // @exclude hash password поле
}

export async function getAllEmployees(req: Request, res: Response, next: NextFunction) 
                                                    : Promise<void> {
    const employees: Employee[] = await appDataSource.getRepository(Employee).find()
    res.status(200).json(instanceToPlain(employees))
}
