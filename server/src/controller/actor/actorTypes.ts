import { z } from "zod"


// create
export const createActorSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.preprocess((val) => new Date(val as string), z.date()),
    employeeId: z.string().min(1),
    gender: z.string(),

    middleName: z.string().optional(),
    city: z.string().optional(),
    eyeColor: z.string().optional(),
    height: z.preprocess((val) => Number(val), z.number()).optional(),
    clothesSize: z.preprocess((val) => Number(val), z.number()).optional(),
    video: z.string().optional(),
    languages: z.string().optional(),
    description: z.string().optional(),
    kinoTeatr: z.string().optional(),
    filmTools: z.string().optional(),
    kinopoisk: z.string().optional(),
})
export type CreateActorType = z.infer<typeof createActorSchema>

export enum GenderEnum {
    Man = 'M',
    Woman = 'W'
}

// edit
export const editActorSchema = z.object({
    id: z.preprocess((val) => Number(val), z.number()),

    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    middleName: z.string().optional(),
    employeeId: z.string().min(1).optional(),
    gender: z.string().optional(),
    dateOfBirth: z.preprocess((val) => new Date(val as string), z.date()).optional(),
    city: z.string().optional(),
    eyeColor: z.string().optional(),
    height: z.preprocess((val) => Number(val), z.number()).optional(),
    clothesSize: z.preprocess((val) => Number(val), z.number()).optional(),
    video: z.string().optional(),
    languages: z.string().optional(),
    description: z.string().optional(),
    kinoTeatr: z.string().optional(),
    filmTools: z.string().optional(),
    kinopoisk: z.string().optional(),
})
export type EditActorType = z.infer<typeof editActorSchema>

export const filterActorSchema = z.object({
    search: z.string().optional(),
    employeeId: z.preprocess((val) => Number(val), z.number()).optional(),
    minAge: z.preprocess((val) => Number(val), z.number()).optional(),
    maxAge: z.preprocess((val) => Number(val), z.number()).optional(),
    minHeight: z.preprocess((val) => Number(val), z.number()).optional(),
    maxHeight: z.preprocess((val) => Number(val), z.number()).optional(),
    clothesSize: z.preprocess((val) => Number(val), z.number()).optional(),
    gender: z.string().optional(),
    cityIds: z.array(z.number()).optional(), // ожидение, что с клиента придёт именно массив чисел
    eyeIds: z.array(z.number()).optional(),
    languageIds: z.array(z.number()).optional(),
})

export type FilterActorType = z.infer<typeof filterActorSchema>
