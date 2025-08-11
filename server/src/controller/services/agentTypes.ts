import { z } from "zod"

export const createAgentSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    middleName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(1),
    phone: z.string().min(1),
    description: z.string().optional(),
    telegram: z.string().optional(),
    vk: z.string().optional(),
})
export type CreateAgentType = z.infer<typeof createAgentSchema>

export interface IJwtPayload {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
}