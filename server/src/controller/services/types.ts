import { z } from "zod";

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
});
export type CreateAgentType = z.infer<typeof createAgentSchema>;

export interface IJwtPayload {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
}

export const createActorSchema = z.object({
    dateOfBirth: z.preprocess((val) => new Date(val as string), z.date()),
    agentId: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    gender: z.string(),

    middleName: z.string().optional(),
    city: z.string().optional(),
    eyeColor: z.string().optional(),
    height: z.preprocess((val) => parseInt(val as string, 10), z.number()).optional(),
    clothesSize: z.preprocess((val) => parseInt(val as string, 10), z.number()).optional(),
    video: z.string().optional(),
    languages: z.string().optional(),
    description: z.string().optional(),
    kinoTeatr: z.string().optional(),
    filmTools: z.string().optional(),
    kinopoisk: z.string().optional(),
});
export type CreateActorType = z.infer<typeof createActorSchema>;

export enum GenderEnum {
    Man = 'M',
    Woman = 'W'
}
