import { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import ApiError from "../error/apiError"


export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction): void {
    console.error(err)

    if (err instanceof ApiError) {
        res.status(err.status).json({
            status: err.status,
            message: err.message,
        })
    } else if (err instanceof Error) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    } else {
        res.status(500).json({
            status: 500,
            message: "Unexpected error",
        })
    }
}