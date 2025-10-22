// Типы для api хранятся в данном файле:
// * REQUEST для формирования запроса
// * остальное для парсинга входящих данных

// ================================ REQUEST ================================
export interface RegisterUserType {
    name: string;
    email: string;
    password: string;
}

export interface LoginUserType {
    email: string;
    password: string;
}

// ================================ USER DATA ================================
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

// ================================ AUTH ================================

export interface IAuthorized {
    accessToken: string;
    user: IUser;
}

export function toIAuthorized(raw: any) {
    return {
        accessToken: raw.token,
        user: toIUser(raw.user)
    }
}

// USER DATA и AUTH типы описаны на сервере в src/controller/auth/authTypes.ts, должны быть те же значения.
// IAuthorized:
// {
//   "accessToken"
//   "user": {
//     "id",
//     "name",
//     "email",
//     "isAdmin"
//   }
// }