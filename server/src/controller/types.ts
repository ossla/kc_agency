import { z } from "zod"


export const CreateAgentSchema = z.object({
    first_name: z.string().min(1, "введите Имя"),
    last_name: z.string().min(1, "введите фамилию"),
    middle_name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(1, "введите пароль"),
    phone: z.string().min(1, "введите номер телефона"),
    description: z.string().optional(),
    telegram: z.string().optional(),
    VK: z.string().optional()
});
export type CreateAgentType = z.infer<typeof CreateAgentSchema>;


export const CreateActorSchema = z.object({
    first_name: z.string().min(1, "введите Имя"),
    last_name: z.string().min(1, "введите фамилию"),
    middle_name: z.string().optional(),
    date_of_birth: z.date(),
    height: z.number(),
    clothes_size: z.string().min(1),
    description: z.string().optional(),
    kino_teatr: z.string().optional(),
    film_tools: z.string().optional(),
    kinopoisk: z.string().min(1),
    video: z.string().optional(),
    agent: z.number(),
    eye_color: z.string().min(1),
    city: z.string().min(1),
    languages: z.string().optional(),
});
export type CreateActorType = z.infer<typeof CreateActorSchema>;
