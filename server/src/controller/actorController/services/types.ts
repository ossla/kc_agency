import { z } from "zod"


export const CreateActorSchema = z.object({
    date_of_birth: z.preprocess((val) => new Date(val as string), z.date()), // 1947-05-20
    agentId: z.string().min(1),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    gender: z.string().min(1),

    middle_name: z.string().optional(),
    city: z.string().optional(),
    eye_color: z.string().optional(),
    height: z.preprocess((val) => parseInt(val as string, 10), z.number()).optional(),
    clothes_size: z.preprocess((val) => parseInt(val as string, 10), z.number()).optional(),
    video: z.string().optional(),
    languages: z.string().optional(),
    description: z.string().optional(),
    kino_teatr: z.string().optional(),
    film_tools: z.string().optional(),
    kinopoisk: z.string().optional(),
});
export type CreateActorType = z.infer<typeof CreateActorSchema>;
