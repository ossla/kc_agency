import { Request, Response, NextFunction } from "express"
import { appDataSource } from "../../data-source"
import { Language } from "../../entity/language.entity"
import processApiError from "../../error/processError"

async function getOne(id: number): Promise<Language> {
    const language: Language | null = await appDataSource
                                            .getRepository(Language)
                                            .findOne({where: { id }})
    if (!language) {
        throw new Error("Language с таким id нет")
    }

    return language
}

export async function getLanguage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const language: Language = await getOne(Number(id))

        res.status(200).json(language)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function getLanguages(req: Request, res: Response, next: NextFunction) {
    try {
        const languages: Language[] = await appDataSource.getRepository(Language).find()
        res.status(200).json(languages)
        
    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function removeLanguage(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.body
        await appDataSource.getRepository(Language).delete(Number(id))

        res.status(200).json("deleted successfully")

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}