import { Request, Response, NextFunction } from "express"
import { appDataSource } from "../../data-source"
import { EyeColor } from "../../models/eyeColor.entity"
import processApiError from "../../error/processError"

async function getOne(id: number): Promise<EyeColor> {
    const eyeColor: EyeColor | null = await appDataSource
                                            .getRepository(EyeColor)
                                            .findOne({where: { id }})
    if (!eyeColor) {
        throw new Error("eyeColor с таким id нет")
    }

    return eyeColor
}

export async function getEyeColor(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const eyeColor: EyeColor = await getOne(Number(id))

        res.status(200).json(eyeColor)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function getEyeColors(req: Request, res: Response, next: NextFunction) {
    try {
        const eyeColors: EyeColor[] = await appDataSource.getRepository(EyeColor).find()
        res.status(200).json(eyeColors)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function removeEyeColor(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.body
        await appDataSource.getRepository(EyeColor).delete(Number(id))

        res.status(200).json("deleted successfully")

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}