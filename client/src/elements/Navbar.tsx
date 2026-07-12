import { Link } from "react-router-dom"
import { ACTORS_MEN, ACTORS_WOMEN, EMPLOYEES, HOME } from "../routes"
import "../styles/Navbar.css"
import { useUser } from "../context/UserContext"
import { IUser } from "../api/types/userTypes"
import { useState } from "react"


function AuthEl(props: { user: IUser | null; classn: string }) {
    return (
        <div className={props.classn}>
            {props.user && <Link to="/profile">{props.user.name}</Link>}
        </div>
    )
}

export default function Navbar() {
    const { user } = useUser()
    const [menuOpen, setMenuOpen] = useState(false)
    const [aboutOpen, setAboutOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(prev => !prev)
    }

    const handleLinkClick = () => {
        setMenuOpen(false)
        setAboutOpen(false)
    }

    return (
        <nav className="navbar">

            {/* ЛЕВАЯ ЧАСТЬ — БРЕНД */}
            <div className="nav-left">
                <Link to={HOME} className="brand">
                <img src="/logo/logo_small.svg" className="brand-logo" />

                <div className="brand-text">
                    <div className="brand-main">
                    <span className="brand-title">БЕРЕГ</span>
                    <span className="brand-subtitle">кино</span>
                    </div>

                    <div className="brand-tagline">
                    АГЕНТСТВО ТАЛАНТОВ
                    </div>
                </div>
                </Link>
            </div>

            {/* ПРАВАЯ ЧАСТЬ */}
            <div className="nav-right">

                {/* ГАМБУРГЕР */}
                <div className="menu-icon" onClick={toggleMenu}>
                <span className="navicon"></span>
                </div>

                {/* МЕНЮ */}
                <ul className={`menu ${menuOpen ? "open" : ""}`}>
                <li>
                    <Link to={ACTORS_MEN} onClick={handleLinkClick}>АКТЁРЫ</Link>
                </li>
                <li>
                    <Link to={ACTORS_WOMEN} onClick={handleLinkClick}>АКТРИСЫ</Link>
                </li>
                {/* <li>
                    <Link to={EMPLOYEES} onClick={handleLinkClick}>КОМАНДА</Link>
                </li> */}
                <li className={`menu-dropdown ${aboutOpen ? "open" : ""}`}>
                    <button
                        type="button"
                        className="menu-dropdown-toggle"
                        onClick={() => setAboutOpen(prev => !prev)}
                    >
                        О НАС
                    </button>
                    <div className="menu-dropdown-list">
                        <Link to={HOME} onClick={handleLinkClick}>АГЕНТСТВО</Link>
                        <Link to={EMPLOYEES} onClick={handleLinkClick}>КОМАНДА</Link>
                    </div>
                </li>
                <li className="menu-mobile-only">
                    <Link to={EMPLOYEES} onClick={handleLinkClick}>КОМАНДА</Link>
                </li>
                <li className="menu-mobile-only">
                    <Link to={HOME} onClick={handleLinkClick}>АГЕНТСТВО</Link>
                </li>

                {/* АВТОРИЗАЦИЯ ВНУТРИ БУРГЕРА */}
                <li className="auth-mobile">
                    <AuthEl classn="" user={user} />
                </li>
                </ul>

                {/* АВТОРИЗАЦИЯ НА ДЕСКТОПЕ */}
                <AuthEl classn="auth-deskop" user={user} />

            </div>
        </nav>
    )
}
