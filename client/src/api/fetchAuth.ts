import { clearUser, updateUser } from "../context/UserUpdaterBridge"
import { ResponseHandler } from "./ResponseHandler"
import { IAuthorized, LoginUserType, RegisterUserType, toIAuthorized, toIUser } from "./types/userTypes"
import { authURL, loginURL, logoutURL, registrationURL } from "./URLs"


class fetchAuth {
    // ================== AUTHORIZATION ==================
    static async registration(raw: RegisterUserType): Promise<IAuthorized> {
        if (!raw.email || !raw.password || !raw.name) {
            throw new Error("Должны быть заполнены все поля")
        }
        const response = await fetch(registrationURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(raw),
            credentials: "include"
        })

        const data: IAuthorized = await ResponseHandler<IAuthorized>(response, toIAuthorized)
        console.log("registration resp data: " + data)
        updateUser(data.user, data.accessToken)
        return data
    }

    static async login(raw: LoginUserType): Promise<IAuthorized> {
        if (!raw.email || !raw.password) {
            throw new Error("Должны быть заполнены все поля")
        }
        console.log(raw)
        
        const response = await fetch(loginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(raw),
            credentials: "include"
        })

        const data: IAuthorized = await ResponseHandler<IAuthorized>(response, toIAuthorized)
        console.log("login resp data: " + data)
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
            console.log("auth resp data: " + JSON.stringify(data))
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
    static async logout(): Promise<boolean> {
        try {
            const response = await fetch(logoutURL, {
                method: "POST",
                credentials: "include"
            })

            clearUser()
            return true

        } catch (error: any) {
            throw error
        }
    }
}

export default fetchAuth