import ApiError from "./apiError"
import { NextFunction } from "express"

export default function processApiError(error: unknown, next: NextFunction) {
    if (error instanceof ApiError) {
        console.error(error.message)
        next(error.message)
    } else if (error instanceof Error) {
        console.error(error.message)
        next(new ApiError(500, error.message))
    } else if (typeof error === "string") {
        console.error(error)
        next(new ApiError(500, error))
    } else {
        next(new ApiError(500, "Unexpected error"))
    }
}