import { z } from "zod"


export const CreateAgentSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    middle_name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(1),
    phone: z.string().min(1),
    description: z.string().optional(),
    telegram: z.string().optional(),
    VK: z.string().optional()
});
export type CreateAgentType = z.infer<typeof CreateAgentSchema>;

export interface IJwtPayload {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}