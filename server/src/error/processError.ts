import ApiError from "./apiError"
import { NextFunction } from "express"

export function processDefaultError(error: unknown) {
    if (error instanceof Error) {
        throw new Error(error.message)
    } else if (typeof error === "string") {
        throw new Error(error)
    } else {
        throw new Error("unexpected err")
    }
}

export default function processApiError(status: number, error: unknown, next: NextFunction) {
    if (error instanceof Error) {
        console.error(error.message);
        if (status === 404) {
            next(ApiError.badRequest(error.message))
        } else {
            next(ApiError.internal(error.message))
        }
    } else if (typeof error === "string") {
        console.error(error)
        next(ApiError.badRequest(error))
    } else {
        throw new Error("unexpected err")
    }
}
