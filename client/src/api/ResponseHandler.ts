import { ApiError } from "./apiError";

export interface HttpError extends Error {
    status: number;
    message: string;
}

export async function ResponseHandler<T>(response: Response
                            , toT: (arg: any) => T): Promise<T> {
    let data

    // не json ошибка
    try { 
        data = await response.json()
        
    } catch {
        throw new ApiError(
            response.status,
            await response.text() || "Ошибка при получении данных с сервера"
        )
    }

    // возврат ошибки json
    if (!response.ok) {
        throw new ApiError(
            response.status,
            data.message || "Ошибка сервера"
        )
    }

    return toT(data)
}


// если нужно получить и обработать массив объектов
export async function ResponseHandlerMap<T>(response: Response
                            , toT: (arg: any) => T): Promise<T[]> {
    let data

    // не json ошибка
    try { 
        data = await response.json()
        
    } catch {
        throw new ApiError(
            response.status,
            await response.text() || "Ошибка при получении данных с сервера"
        )
    }

    // возврат ошибки json
    if (!response.ok) {
        throw new ApiError(
            response.status,
            data.message || "Ошибка сервера"
        )
    }

    return data.map(toT)
}

