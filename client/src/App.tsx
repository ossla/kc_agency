import { BrowserRouter as Router, useLocation } from "react-router-dom"

import AppRoutes from "./AppRoutes"
import NavBar from "./elements/Navbar"
import { UserProvider } from "./context/UserContext"
import { useEffect } from "react"
import fetchAuth from "./api/fetchAuth"



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