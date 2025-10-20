import { useContext } from "react"
import { Link } from "react-router-dom"

import { ACTORS } from "../routes"
import { UserContext } from "../context/UserContext"
import "../styles/Navbar.css"


export default function Navbar() {
    const user = useContext(UserContext)

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to={ACTORS}>
                    <img src="logo192.png" alt="Logo" />
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
                <li>
                    <Link to="/login">Войти</Link>
                </li>
            </ul>
        </nav>
    );
}
