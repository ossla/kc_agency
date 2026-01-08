import { Request, Response, NextFunction } from "express"
import { appDataSource } from "../../data-source"
import ApiError from "../../error/apiError"
import { HairColor } from "../../models/hairColor.entity"

async function getOne(id: number): Promise<HairColor> {
    const hairColor: HairColor | null = await appDataSource
                                            .getRepository(HairColor)
                                            .findOne({where: { id }})
    if (!hairColor) {
        throw ApiError.badRequest("hairColor с таким id нет")
    }

    return hairColor
}

export async function getHairColor(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const hairColor: HairColor = await getOne(Number(id))

    res.status(200).json(hairColor)
}

export async function getHairColors(req: Request, res: Response, next: NextFunction) {
    const hairColor: HairColor[] = await appDataSource.getRepository(HairColor).find()
    res.status(200).json(hairColor)
}

export async function removeHairColor(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body
    await appDataSource.getRepository(HairColor).delete(Number(id))

    res.status(200).json("deleted successfully")
}