import React from "react"
import ErrorElement from "./ErrorElement"

export class DefaultError extends Error {
    status: number
    message: string

    constructor(status: number, message: string) {
        super()
        this.status = status
        this.message = message
    }

    getError(): React.JSX.Element {
        return <ErrorElement err={this} />
    }
}


export function processDefaultError(error: unknown): DefaultError {
    if (error instanceof Error) {
        return new DefaultError(418, error.message)
    } else if (typeof error === "string") {
        return new DefaultError(418, error)
    } else {
        return new DefaultError(418, "unexpected error")
    }
}