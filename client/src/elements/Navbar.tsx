import { Link } from "react-router-dom"
import { ACTORS } from "../routes"
import "../styles/Navbar.css"
import { useUser } from "../context/UserContext"


export default function Navbar() {
    const { user } = useUser()

    return (
        <nav className="navbar">
            <input type="checkbox" id="menu-btn" className="menu-btn" />
            <label htmlFor="menu-btn" className="menu-icon">
                <span className="navicon"></span>
            </label>

            <Link to={ACTORS} className="logo-mobile">
                <img src="bereg_logo.png" alt="Logo" />
            </Link>

            <ul className="menu">
                <li><Link to="/actors">Актёры</Link></li>
                <li className="logo-desktop">
                    <Link to={ACTORS}>
                        <img src="bereg_logo.png" alt="Logo" />
                    </Link>
                </li>
                <li><Link to="/agents">Агенты</Link></li>
            </ul>

            <div className="auth">
                {user ? (
                    <Link to="/profile">{user.name}</Link>
                ) : (
                    <>
                        <Link to="/login">Войти</Link>
                        <Link to="/registration">Регистрация</Link>
                    </>
                )}
            </div>
        </nav>
    )
}
