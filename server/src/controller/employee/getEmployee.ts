import { Request, Response, NextFunction } from "express"
import { instanceToPlain } from "class-transformer" 

import processApiError from "../../error/processError"
import { Employee } from "../../models/employee.entity"
import { appDataSource } from "../../data-source"
import ApiError from "../../error/apiError"


export async function getEmployee(id: number): Promise<Employee> {
    const employee: Employee | null = await appDataSource
                                            .getRepository(Employee)
                                            .findOne({where: { id }})
    if (!employee) {
        throw new ApiError(401, "агента с таким id нет")
    }

    return employee
}

export async function getOneEmployee(req: Request, res: Response, next: NextFunction) 
                                                        : Promise<void> {
    try {
        const { id } = req.params
        const idNum = Number(id)
        if (!id || !Number.isInteger(idNum)) {
            throw new ApiError(400, "укажите корректный id")
        }
        const employee: Employee = await getEmployee(Number(id))
        
        res.status(200).json(instanceToPlain(employee)) // @exclude hash password поле

    } catch (error: unknown) {
        processApiError(error, next)
    }
}

export async function getAllEmployees(req: Request, res: Response, next: NextFunction) 
                                                    : Promise<void> {
    try {
        const employees: Employee[] = await appDataSource.getRepository(Employee).find()
        res.status(200).json(instanceToPlain(employees))

    } catch (error: unknown) {
        processApiError(error, next)
    }
}

export async function getShortEmployees(req: Request, res: Response, next: NextFunction) 
                                                    : Promise<void> {
    try {
        const actors = await appDataSource.getRepository(Employee)
            .createQueryBuilder("employee")
            .select(["employee.id", "employee.firstName", "employee.lastName", "employee.photo"])
            .getMany()

        res.json(actors);

    } catch (error: unknown) {
        processApiError(error, next)
    }
}
