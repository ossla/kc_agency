import { Request, Response, NextFunction } from "express"
import { appDataSource } from "../../data-source"
import { City } from "../../models/city.entity"
import ApiError from "../../error/apiError"


async function getOne(id: number): Promise<City> {
    const city: City | null = await appDataSource
                                            .getRepository(City)
                                            .findOne({where: { id }})
    if (!city) {
        throw ApiError.badRequest("city с таким id нет")
    }

    return city
}

export async function getCity(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const city: City = await getOne(Number(id))

    res.status(200).json(city)
}

export async function getCities(req: Request, res: Response, next: NextFunction) {
    const cities: City[] = await appDataSource.getRepository(City).find()
    res.status(200).json(cities)
    
}

export async function removeCity(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body
    await appDataSource.getRepository(City).delete(Number(id))

    res.status(200).json(true)
}