import { Link } from "react-router-dom"
import { ACTORS } from "../routes"
import "../styles/Navbar.css"
import { useUser } from "../context/UserContext"
import { IUser } from "../api/types/userTypes"
import { useState } from "react"

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

            <Link to={ACTORS} className="logo-mobile">
                <img src="bereg_logo.png" alt="Logo" />
            </Link>

            <ul className={`menu ${menuOpen ? "open" : ""}`}>
                <li><Link to="/actors" onClick={handleLinkClick}>Актёры</Link></li>
                
                <li className="logo-desktop">
                    <Link to={ACTORS} onClick={handleLinkClick}>
                        <img src="bereg_logo.png" alt="Logo" />
                    </Link>
                </li>
                
                <li><Link to="/agents" onClick={handleLinkClick}>Агенты</Link></li>

            </ul>
            <AuthEl classn="auth-mobile" user={user} onClick={handleLinkClick} />

            <AuthEl classn="auth-deskop" user={user} />
        </nav>
    )
}
