export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

export function processError(e: unknown): string {
    if (e instanceof ApiError) return e.message
    else if (e instanceof Error) return e.message
    return "неизвестная ошибка"
}
