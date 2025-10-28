
// Типы для api хранятся в данном файле:
// * REQUEST для формирования запроса
// * RESPONSE для парсинга входящих данных

// ================================ REQUEST ================================
// export interface CreateAgentType {
//     firstName: string,
//     lastName: string,
//     middleName: string,
//     email: string,
//     phone: string,
//     description: string,
//     telegram: string,
//     vk: string,
//     photo: File
// }

// ================================ RESPONSE ================================
export interface IAgent {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    photo: string,
    createdAt: Date,
    updatedAt: Date
    // необязательные поля
    middleName?: string,
    description?: string,
    telegram?: string,
    VK?: string,
}

export function toIAgent(raw: any): IAgent {
    return {
        id: raw.id,
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        photo: raw.photo,
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),

        // необязательные поля
        middleName: raw.middleName ?? undefined,
        phone: raw.phone ?? undefined,
        description: raw.description ?? undefined,
        telegram: raw.telegram ?? undefined,
        VK: raw.VK ?? undefined,
    }
}

export interface IShortAgent {
    id: number,
    firstName: string,
    lastName: string,
    avatarUrl: string
}

export function toIShortAgent(raw: any): IShortAgent {
    return {
        id: raw.id,
        firstName: raw.firstName,
        lastName: raw.lastName,
        avatarUrl:`http://localhost:3001/${raw.photo}.jpg`,
    }
}
