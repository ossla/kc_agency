import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ActorPage } from "./pages/ActorsPage"
import { Actor } from "./components/Actor"
import { GenderEnum } from "./types/enums"
import { AppRoutes } from "./routes/AppRoutes"
import Navbar from "./elements/NavBar"


export default function App() {
    return (
        <Router>
            <Navbar />
            <AppRoutes />
        </Router>
    )
}
