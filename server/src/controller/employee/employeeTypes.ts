import { z } from "zod"

export const createEmployeeSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),

    middleName: z.string().optional(),
    description: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    telegram: z.string().optional(),
    vk: z.string().optional()
})
export type CreateEmployeeType = z.infer<typeof createEmployeeSchema>

const socialLink = z.string().trim().max(100).refine(
    value => !value || /^https?:\/\//i.test(value) && z.string().url().safeParse(value).success,
    "Укажите ссылку с http:// или https://",
)

export const editEmployeeSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string().trim().min(1).max(40).optional(),
    lastName: z.string().trim().min(1).max(40).optional(),
    middleName: z.string().trim().max(40).optional(),
    email: z.string().trim().email().max(100).optional(),
    phone: z.string().trim().min(1).max(20).optional(),
    description: z.string().optional(),
    telegram: z.string().trim().max(100).optional(),
    instagram: socialLink.optional(),
    facebook: socialLink.optional(),
    vk: socialLink.optional(),
})
