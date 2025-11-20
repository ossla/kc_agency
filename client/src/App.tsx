import { BrowserRouter as Router, useLocation } from "react-router-dom"

import AppRoutes from "./AppRoutes"
import NavBar from "./elements/Navbar"
import { UserProvider } from "./context/UserContext"
import { useEffect } from "react"
import fetchAuth from "./api/fetchAuth"
import Footbar from "./elements/Footbar"
import "./styles/Main.css"


export default function App() {
    return (
        <Router>
            <UserProvider>
                <div className="page-wrapper">
                <NavBar />
            
                <div className="page-content">
                    <AppRoutes />
                </div>

                    <Footbar />
                </div>
            </UserProvider>
        </Router>
    )
}