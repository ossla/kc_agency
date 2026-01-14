import { ApiError } from "./apiError";

export interface HttpError extends Error {
    status: number;
    message: string;
}

export async function ResponseHandler<T>(response: Response
                                , toT: (arg: any) => T): Promise<T> {

    const text = await response.text() // ← читаем ОДИН раз

    let data: any
    try {
        data = text ? JSON.parse(text) : null
    } catch {
        throw new ApiError(
            response.status,
            text || "Ошибка при получении данных с сервера"
        )
    }

    if (!response.ok) {
        throw new ApiError(
            response.status,
            data?.message || "Ошибка сервера"
        )
    }

    return toT(data)
}



// если нужно получить и обработать массив объектов
export async function ResponseHandlerMap<T>(response: Response
                                , toT: (arg: any) => T): Promise<T[]> {

    const text = await response.text()

    let data: any
    try {
        data = text ? JSON.parse(text) : null
    } catch {
        throw new ApiError(
            response.status,
            text || "Ошибка при получении данных с сервера"
        )
    }

    if (!response.ok) {
        throw new ApiError(
            response.status,
            data?.message || "Ошибка сервера"
        )
    }

    return data.map(toT)
}

