
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
export interface IEmployee {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    avatarUrl: string,
    createdAt: Date,
    updatedAt: Date,

    // необязательные поля
    middleName?: string,
    description?: string,
    telegram?: string,
    instagram?: string,
    facebook?: string,
    vk?: string,
}

export function toIEmployee(raw: any): IEmployee {
    return {
        id: raw.id,
        firstName: raw.firstName,
        lastName: raw.lastName,
        email: raw.email,
        avatarUrl: `/${raw.photo}`,
        createdAt: new Date(raw.createdAt),
        updatedAt: new Date(raw.updatedAt),

        // необязательные поля
        middleName: raw.middleName ?? undefined,
        phone: raw.phone ?? undefined,
        description: raw.description ?? undefined,
        telegram: raw.telegram ?? undefined,
        facebook: raw.facebook ?? undefined,
        instagram: raw.instagram ?? undefined,
        vk: raw.vk ?? undefined,
    }
}
