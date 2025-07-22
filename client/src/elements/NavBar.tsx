import { NavLink } from "react-router-dom"

export function Navbar() {
    return (
        <nav className="navbar">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-800"
                }
            >
                Главная
            </NavLink>
            <NavLink
                to="/men"
                className={({ isActive }) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-800"
                }
            >
                Актёры
            </NavLink>
            <NavLink
                to="/women"
                className={({ isActive }) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-800"
                }
            >
                Актрисы
            </NavLink>
            <NavLink
                to="/agents"
                className={({ isActive }) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-800"
                }
            >
                Агенты
            </NavLink>
        </nav>
    )
}
