import ApiError from "../../error/apiError"

export interface IUser {
    id: string
    name: string
    email: string
    isAdmin: boolean
}

export interface IAuthorized {
    accessToken: string
    user: IUser
}


export function validateEmailAndPassword(email: unknown, password: unknown) {

    if (typeof email !== "string") {
        throw new ApiError(400, "Некорректный email")
    }

    if (typeof password !== "string") {
        throw new ApiError(400, "Некорректный пароль")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Некорректный email")
    }

    if (password.length < 7) {
        throw new ApiError(400, "Пароль менее 7 символов")
    }

    if (!/\d/.test(password)) {
        throw new ApiError(400, "Пароль должен содержать хотя бы одну цифру")
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        throw new ApiError(400, "Пароль должен содержать символ")
    }
}