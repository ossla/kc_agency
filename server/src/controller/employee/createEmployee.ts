import { NextFunction, Response } from "express"

import { ICustomRequest } from "../../middleware/authMiddleware"
import { createEmployeeSchema, CreateEmployeeType } from "./employeeTypes"
import { appDataSource } from "../../data-source"
import { Employee } from "../../models/employee.entity"
import processApiError from "../../error/processError"
import { CustomFileType, /** makeEmployeePhotoName,*/ removePhoto, savePhoto } from "../services/fileSystemService"
import ApiError from "../../error/apiError"


export async function createEmployee(req: ICustomRequest, res: Response, next: NextFunction) {
    let photoName: string = ""
    try {
        console.log("create employee controller starts...")
        const body: CreateEmployeeType = createEmployeeSchema.parse(req.body)

        const is_exist = await appDataSource.getRepository(Employee)
                                            .findOne({where: {email: body.email}})
        if (is_exist) throw new Error('Пользователь с таким email уже существует')

        const photo: CustomFileType = req.files?.photo
        if (!photo) {
            throw new ApiError(400, "Необходимо добавить поле photo для загрузки аватара")
        }
        photoName = crypto.randomUUID()
        await savePhoto(photo, photoName + ".jpg")

        const employee: Employee = new Employee()
        employee.firstName = body.firstName
        employee.lastName = body.lastName
        employee.middleName = body.middleName ?? null
        employee.email = body.email
        employee.phone = body.phone
        employee.description = body.description ?? null
        employee.photo = photoName
        employee.telegram = body.telegram ?? null
        employee.vk = body.vk ?? null

        await appDataSource.getRepository(Employee).save(employee)
        res.status(201).json(employee)

    } catch (error: any) {
        if (photoName != "") {
            await removePhoto(photoName)
        }
        processApiError(error, next)
    }
} // create
