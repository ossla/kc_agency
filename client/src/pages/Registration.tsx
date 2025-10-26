import { useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/Login.css"
import fetchAuth from "../api/fetchAuth"
import { ACTORS } from "../routes"


export default function Registration() {
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [name, setName] = useState<string>()
    const navigator = useNavigate()
    
    const registrationClick = async () => {
        await fetchAuth.registration({email, name, password})
        navigator(ACTORS)
    }

    return (
        <div className="login-container">
            <h1>Регистрация</h1>
            <input 
                type="text" 
                placeholder="Почта"
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
            />
            <input 
                type="text" 
                placeholder="Имя"
                onChange={(e) => setName(e.target.value)}
                value={name} 
            />
            <input
                type="password"
                placeholder="Пароль"
                onChange={(e) => setPassword(e.target.value)}
                value={password} 
            />
            <button onClick={registrationClick}>Регистрация</button>
        </div>
    )
}