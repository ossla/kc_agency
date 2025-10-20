import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import AppRoutes from "./AppRoutes"
import NavBar from "./elements/Navbar"
import { UserProvider } from "./context/UserContext"


export default function App() {
    return (
        <Router>
            <UserProvider>
                <NavBar />
                <AppRoutes />
            </UserProvider>
        </Router>
    )
}