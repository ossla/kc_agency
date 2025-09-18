// Типы для api хранятся в данном файле:
// * REQUEST для формирования запроса
// * RESPONSE для парсинга входящих данных

// ================================ REQUEST ================================
export interface RegisterUserType {
    name: string;
    email: string;
    password: string;
}

// ================================ RESPONSE ================================
export interface IUser {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
}

export function toIUser(raw: any): IUser {
    return {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        isAdmin: raw.isAdmin
    }
}