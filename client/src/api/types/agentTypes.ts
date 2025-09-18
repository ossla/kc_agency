
// Типы для api хранятся в данном файле:
// * REQUEST для формирования запроса
// * RESPONSE для парсинга входящих данных

// ================================ REQUEST ================================
export interface CreateAgentType {
    firstName: string,
    lastName: string,
    middleName: string,
    email: string,
    phone: string,
    description: string,
    telegram: string,
    vk: string
}

// ================================ RESPONSE ================================
export interface IAgent {
    id: number,
    firstName: string,
    lastName: string,
    middleName?: string,
    email: string,
    phone: string,
    description?: string,
    photo: string,
    telegram?: string,
    VK?: string,
    isAdmin: boolean,
    createdAt: Date,
    updatedAt: Date
}

export function toIAgent(raw: any): IAgent {
    return {
        id: raw.id,
        firstName: raw.firstName,
        lastName: raw.lastName,
        middleName: raw.middleName ?? undefined,
        email: raw.email,
        phone: raw.phone ?? undefined,
        photo: raw.photo,
        description: raw.description ?? undefined,
        telegram: raw.telegram ?? undefined,
        VK: raw.VK ?? undefined,
        isAdmin: raw.isAdmin ?? undefined,
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),
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
        avatarUrl:`http://localhost:3001/${raw.photo}`,
    }
}
