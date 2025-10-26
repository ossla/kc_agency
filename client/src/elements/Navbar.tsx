import { useContext } from "react"
import { Link } from "react-router-dom"

import { ACTORS } from "../routes"
import "../styles/Navbar.css"
import { useUser } from "../context/UserContext"


export default function Navbar() {
    const { user } = useUser()

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to={ACTORS}>
                    <img src="bereg_logo.png" alt="Logo" />
                </Link>
            </div>

            <input type="checkbox" id="menu-btn" className="menu-btn" />
            <label htmlFor="menu-btn" className="menu-icon">
                <span className="navicon"></span>
            </label>

            <ul className="menu">
                <li>
                    <Link to="/actors">Актёры</Link>
                </li>
                <li>
                    <Link to="/agents">Агенты</Link>
                </li>
            </ul>
            {
                user ?
                <p>
                    <Link to={`/profile/${user.id}`}>{user.name}</Link>
                </p>
                :
                <div>
                    <p>
                        <Link to="/login">Войти</Link>
                    </p>
                    <p>
                        <Link to="/registration">Регистрация</Link>
                    </p>
                </div>
            }
        </nav>
    );
}
