import { z } from "zod"

export const createEmployeeSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    middleName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().min(1),
    description: z.string().optional(),
    telegram: z.string().optional(),
    vk: z.string().optional()
})
export type CreateEmployeeType = z.infer<typeof createEmployeeSchema>