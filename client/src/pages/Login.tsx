import { useState } from "react"
import "../styles/Login.css"
import { IAuthorized } from "../api/types/userTypes"
import fetchAuth from "../api/fetchAuth"
import { useNavigate } from "react-router-dom"
import { DefaultError, processDefaultError } from "../error/ErrorProcessor"
import { useUser } from "../context/UserContext"


async function loginFunc(email: string | undefined, password: string | undefined): Promise<IAuthorized> {
    if (!email || !password || email === "" || password === "") {
        throw new Error("Все поля должны быть заполнены")
    }
    const authData: IAuthorized = await fetchAuth.login({email, password})
    return authData
}

export default function Login() {
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [error, setError] = useState<DefaultError>()
    const { setUser } = useUser()
    const navigator = useNavigate()
    
    const loginClick = async () => {
        try {
            const authData: IAuthorized = await loginFunc(email, password)
            setUser(authData.user)
            navigator("/", {replace: true}) // "replace" для невозможности вернуться назад
        } catch (error: any) {
            setError(processDefaultError(error))
        }
    }

    return (
        <div className="login-container">
            <h1>Вход</h1>
            {error && error.getError()
                // <h1>{error.message}</h1>
            }
            <input 
                type="text" 
                placeholder="Логин"
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
            />
            <input
                type="password"
                placeholder="Пароль"
                onChange={(e) => setPassword(e.target.value)}
                value={password} 
            />
            <button onClick={loginClick}>Войти</button>
        </div>
    )
}