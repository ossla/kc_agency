import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import AppRoutes from "./AppRoutes"
import NavBar from "./elements/Navbar"


export default function App() {
    return (
        <Router>
            <NavBar />
            <AppRoutes />
        </Router>
    )
}