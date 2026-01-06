import { Request, Response, NextFunction } from "express"
import { appDataSource } from "../../data-source"
import { Language } from "../../models/language.entity"
import ApiError from "../../error/apiError"

async function getOne(id: number): Promise<Language> {
    const language: Language | null = await appDataSource
                                            .getRepository(Language)
                                            .findOne({where: { id }})
    if (!language) {
        throw ApiError.badRequest("Language с таким id нет")
    }

    return language
}

export async function getLanguage(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const language: Language = await getOne(Number(id))

    res.status(200).json(language)
}

export async function getLanguages(req: Request, res: Response, next: NextFunction) {
    const languages: Language[] = await appDataSource.getRepository(Language).find()
    res.status(200).json(languages) 
}

export async function removeLanguage(req: Request, res: Response, next: NextFunction) {
    const { id } = req.body
    await appDataSource.getRepository(Language).delete(Number(id))

    res.status(200).json("deleted successfully")
}