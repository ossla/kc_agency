import { BrowserRouter as Router, useLocation } from "react-router-dom"

import AppRoutes from "./AppRoutes"
import NavBar from "./elements/Navbar"
import { UserProvider } from "./context/UserContext"
import Footbar from "./elements/Footbar"
import "./styles/Main.css"

function AppLayout() {
    const location = useLocation()
    const background = location.pathname === "/" ? "/bg/bg_standard.svg" : "/bg/bg_transparent.svg"

    return (
        <div className="page-wrapper" style={{
            backgroundImage: `url("${background}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100vh"
        }}>
            <NavBar />
            
            <div className="page-content">
                <AppRoutes />
            </div>

            <Footbar />
        </div>
    )
}

export default function App() {
    return (
        <Router>
            <UserProvider>
                <AppLayout />
            </UserProvider>
        </Router>
    )
}
