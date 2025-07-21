import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ActorPage } from "./pages/ActorPage"
import { Actor } from "./components/Actor"
import { GenderEnum } from "./types/enums"
import { AppRoutes } from "./routes/AppRoutes"


export default function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    )
}
