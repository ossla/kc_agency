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
        const err: HttpError = {
            name: "HttpError",
            status: response.status,
            message: await response.text() || "Ошибка при получении данных с сервера",
        }
        throw err
    }

    // возврат ошибки json
    if (!response.ok) {
        const err: HttpError = {
            name: "HttpError",
            status: response.status,
            message: (data as any)?.message || "Ошибка при получении данных с сервера",
        }
        throw err
    }

    return toT(data)
}
