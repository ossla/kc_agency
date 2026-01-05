export function ProcessApiError(e: unknown): string {
    if (e instanceof Error) return e.message
    else if (typeof e === "string") return e
    else return "unexpected error"
}