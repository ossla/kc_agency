import { useState } from "react"
import "../styles/Login.css"

export default function Login() {
    const [login, setLogin] = useState<string>()
    const [password, setPassword] = useState<string>()

    return (
        <div className="login-container">
            <h1>Вход администратора</h1>
            <input 
                type="text" 
                placeholder="Логин"
                onChange={(e) => setLogin(e.target.value)} 
                value={login} 
            />
            <input 
                type="password" 
                placeholder="Пароль"
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
            />
            <button>Войти</button>
        </div>
    )
}