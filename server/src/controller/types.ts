import { z } from "zod"


export const CreateAgentSchema = z.object({
    firstName: z.string().min(1, "введите Имя"),
    lastName: z.string().min(1, "введите фамилию"),
    middleName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(1, "введите пароль"),
    phone: z.string().min(1, "введите номер телефона"),
    description: z.string().optional(),
    telegram: z.string().optional(),
    VK: z.string().optional()
});
export type CreateAgentType = z.infer<typeof CreateAgentSchema>;
