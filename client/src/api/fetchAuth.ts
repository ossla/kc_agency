import { clearUser, updateUser } from "../context/UserUpdaterBridge"
import { ResponseHandler } from "./ResponseHandler"
import { IAuthorized, LoginUserType, RegisterUserType, toIAuthorized, toIUser } from "./types/userTypes"
import { authURL, loginURL, registrationURL } from "./URLs"


class fetchAuth {
    // ================== AUTHORIZATION ==================
    static async registration(raw: RegisterUserType): Promise<IAuthorized> {
        const response = await fetch(registrationURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(raw)
        })

        return ResponseHandler<IAuthorized>(response, toIAuthorized)
    }

    static async login(raw: LoginUserType): Promise<IAuthorized> {
        const response = await fetch(loginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(raw),
        })

        const data: IAuthorized = await ResponseHandler<IAuthorized>(response, toIAuthorized)
        updateUser(data.user, data.accessToken)
        return data
    }

    // ================== AUTHENTICATION ==================
    static async auth(): Promise<IAuthorized> {
        try {
            const response = await fetch(authURL, {
                method: "POST",
                credentials: "include", // httpOnly r(efresh токен)
            })

            const data: IAuthorized = await ResponseHandler<IAuthorized>(response, toIAuthorized)
            updateUser(data.user, data.accessToken)
            return data
        } catch (err: any) {
            if (err.status === 401) {
                clearUser()
            }
            throw err
        }
    }

    // ================== DELETE ==================
    
}

export default fetchAuth