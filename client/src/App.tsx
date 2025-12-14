import { BrowserRouter as Router, useLocation } from "react-router-dom"

import AppRoutes from "./AppRoutes"
import NavBar from "./elements/Navbar"
import { UserProvider } from "./context/UserContext"
import { useEffect } from "react"
import fetchAuth from "./api/fetchAuth"
import Footbar from "./elements/Footbar"
import "./styles/Main.css"
import bg from "/background.png"


export default function App() {
    return (
        <Router>
            <UserProvider>
                <div className="page-wrapper"
                style={{
                    backgroundImage: `url("/bg/bg_transparent.svg")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    minHeight: "100vh"
                }}
                >
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