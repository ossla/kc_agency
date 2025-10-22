import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import AppRoutes from "./AppRoutes"
import NavBar from "./elements/Navbar"
import { UserProvider } from "./context/UserContext"
import { useEffect } from "react"
import fetchAuth from "./api/fetchAuth"

async function authenticate() {
    try {
        await fetchAuth.auth()
    } catch (err) {
        console.error(err)
    }
}

export default function App() {
    useEffect(() => {
        authenticate()
    }, [])

    return (
        <Router>
            <UserProvider>
                <NavBar />
                <AppRoutes />
            </UserProvider>
        </Router>
    )
}