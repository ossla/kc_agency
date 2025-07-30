import { useState } from "react"
import { NavLink } from "react-router-dom"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
        isActive ? "text-blue-600 font-semibold" : "text-gray-800"

    return (
        <nav className="border-b-2 border-black mb-5">
            <div className="flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Навигация</h1>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-gray-700 focus:outline-none"
                >
                    ☰
                </button>

                <div className="hidden md:flex space-x-6">
                    <NavLink to="/" className={navLinkStyle}>Главная</NavLink>
                    <NavLink to="/men" className={navLinkStyle}>Актёры</NavLink>
                    <NavLink to="/women" className={navLinkStyle}>Актрисы</NavLink>
                    <NavLink to="/agents" className={navLinkStyle}>Агенты</NavLink>
                </div>
            </div>

            {menuOpen && (
                <div className="flex flex-col space-y-2 px-4 pb-4 md:hidden">
                    <NavLink to="/" className={navLinkStyle}>Главная</NavLink>
                    <NavLink to="/men" className={navLinkStyle}>Актёры</NavLink>
                    <NavLink to="/women" className={navLinkStyle}>Актрисы</NavLink>
                    <NavLink to="/agents" className={navLinkStyle}>Агенты</NavLink>
                </div>
            )}
        </nav>
    )
}