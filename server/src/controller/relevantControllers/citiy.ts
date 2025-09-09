import { Request, Response, NextFunction } from "express"
import { appDataSource } from "../../data-source"
import { City } from "../../models/city.entity"
import processApiError from "../../error/processError"

async function getOne(id: number): Promise<City> {
    const city: City | null = await appDataSource
                                            .getRepository(City)
                                            .findOne({where: { id }})
    if (!city) {
        throw new Error("city с таким id нет")
    }

    return city
}

export async function getCity(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const city: City = await getOne(Number(id))

        res.status(200).json(city)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function getCities(req: Request, res: Response, next: NextFunction) {
    try {
        const cities: City[] = await appDataSource.getRepository(City).find()
        res.status(200).json(cities)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function removeCity(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.body
        await appDataSource.getRepository(City).delete(Number(id))

        res.status(200).json(true)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}