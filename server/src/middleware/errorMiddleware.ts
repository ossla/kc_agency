import { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import ApiError from "../error/apiError"
import { ZodError } from "zod"


// export function errorMiddleware(err: unknown, req: Request, res: Response, _next: NextFunction): void {
//     console.error(err)

//     if (err instanceof ApiError) {
//         res.status(err.status).json({
//             message: err.message,
//         })
//     } else if (err instanceof Error) {
//         res.status(500).json({
//             message: err.message,
//         })
//     } else {
//         res.status(500).json({
//             message: "Unexpected error",
//         })
//     }
// }

export function errorMiddleware(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error("errorMiddleware starts...");
    
    if (err instanceof ZodError) {
        const message = err.errors
        .map(e => e.message)
        .join(", ")
        
        res.status(400).json({
            message
        })
    } else if (err instanceof ApiError) {        
        res.status(err.status).json({
            message: err.message
        })
    } else res.status(500).json({
        message: "Непредвиденная ошибка",
    })
}
