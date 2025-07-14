import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ActorPage } from "./pages/ActorPage"
import { Actor } from "./components/Actor"


export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/actor/" element={<ActorPage />} />
                {/* <Route path="/actor/:id" element={<Actor />} /> */}
            </Routes>
        </Router>
    )
}
