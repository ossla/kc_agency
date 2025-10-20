import { ResponseHandler } from "./ResponseHandler"
import { IAuthorized, IRegistered, IUser, LoginUserType, RegisterUserType, toIAuthorized, toIRegistered, toIUser } from "./types/userTypes"
import { loginURL, registrationURL } from "./URLs"


class fetchAuth {
    // ================== AUTHORIZATION ==================
    static async registration(raw: RegisterUserType): Promise<IRegistered | Error> {
        const response = await fetch(registrationURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(raw)
        })

        return ResponseHandler<IRegistered>(response, toIRegistered)
    }

    static async login(raw: LoginUserType): Promise<IAuthorized> {
        const response = await fetch(loginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(raw),
        })

        return ResponseHandler<IAuthorized>(response, toIAuthorized)
    }

    // ================== AUTHENTICATION ==================
    static async auth(raw: LoginUserType): Promise<IAuthorized> {
        const response = await fetch(loginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer 1`
            },
            body: JSON.stringify(raw),
        })

        return ResponseHandler<IAuthorized>(response, toIAuthorized)
    }

    // ================== DELETE ==================
}

export default fetchAuth
