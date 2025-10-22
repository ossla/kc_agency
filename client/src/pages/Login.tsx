import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/Login.css"
import { IAuthorized } from "../api/types/userTypes"
import { useUser } from "../context/UserContext"
import fetchAuth from "../api/fetchAuth"


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
    const { setUser } = useUser()
    const navigator = useNavigate()
    
    const loginClick = async () => {
        const authData: IAuthorized = await loginFunc(email, password)
        setUser(authData.user)
        navigator("/", {replace: true}) // "replace" для невозможности вернуться назад
    }

    return (
        <div className="login-container">
            <h1>Вход</h1>
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