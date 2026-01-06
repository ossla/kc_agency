import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import "../styles/Main.css"
import "../styles/Login.css"
import fetchAuth from "../api/fetchAuth"
import { PROFILE } from "../routes"
import { processError } from "../api/apiError"


export default function Login() {
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const navigator = useNavigate()

    const loginClick = async () => {
        try {
            setError(null)
            await fetchAuth.login({ email, password })
            navigator(PROFILE)
        } catch (e: unknown) {
            setError(processError(e))
        }
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

            {
                error !== null &&
                <p className="error">{error}</p>
            }

            <button onClick={loginClick}>Войти</button>
            <p className="login-proposal">Нет аккаунта? <Link to="/registration/">Зарегистрируйтесь!</Link></p>
        </div>
    )
}