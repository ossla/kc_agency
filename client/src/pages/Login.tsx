import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/Login.css"
import { IAuthorized } from "../api/types/userTypes"
import { useUser } from "../context/UserContext"
import fetchAuth from "../api/fetchAuth"


export default function Login() {
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const navigator = useNavigate()
    
    const loginClick = async () => {
        await fetchAuth.login({email, password})
        navigator("/")
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