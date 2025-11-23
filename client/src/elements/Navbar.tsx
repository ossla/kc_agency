import { Link } from "react-router-dom"
import { ACTORS_MEN, ACTORS_WOMEN, HOME } from "../routes"
import "../styles/Navbar.css"
import { useUser } from "../context/UserContext"
import { IUser } from "../api/types/userTypes"
import { useState } from "react"
import logo from "../assets/bereg_logo.png"


function AuthEl(props: { user: IUser | null; classn: string; onClick?: () => void }) {
    return (
        <div className={props.classn}>
            {props.user ? (
                <Link to="/profile" onClick={props.onClick}>{props.user.name}</Link>
            ) : (
                <Link to="/login" onClick={props.onClick}>Войти</Link>
            )}
        </div>
    )
}

export default function Navbar() {
    const { user } = useUser()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLinkClick = () => {
        setMenuOpen(false)
    }

    const toggleMenu = () => {
        setMenuOpen(prev => !prev)
    }

    return (
        <nav className="navbar">
            {/* скрытый чекбокс больше не нужен */}
            <div className="menu-icon" onClick={toggleMenu}>
                <span className="navicon"></span>
            </div>

            <Link to={HOME} className="logo-mobile">
                <img src="/bereg_logo.png" alt="Logo" />
            </Link>

            <ul className={`menu ${menuOpen ? "open" : ""}`}>
                <li><Link to={ACTORS_MEN} onClick={handleLinkClick}>Актёры</Link></li>
                
                <li className="logo-desktop">
                    <Link to={HOME} onClick={handleLinkClick}>
                        <img src="/bereg_logo.png" alt="Logo" />
                    </Link>
                </li>
                
                <li><Link to={ACTORS_WOMEN} onClick={handleLinkClick}>Актрисы</Link></li>

            </ul>
            <AuthEl classn="auth-mobile" user={user} onClick={handleLinkClick} />

            <AuthEl classn="auth-deskop" user={user} />
        </nav>
    )
}
