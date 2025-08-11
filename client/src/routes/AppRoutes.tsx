import { Routes, Route } from "react-router-dom"

import { ActorsPage } from "../pages/ActorsPage"
import { Actor } from "../components/Actor"
import { GenderEnum } from "../types/enums"
import HomePage from "../pages/HomePage"
import { AgentsPage } from "../pages/AgentPage"
import { Agent } from "../components/Agent"


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/actors" element={ <ActorsPage /> } />
            <Route path="/agents" element={ <AgentsPage />} />
            <Route path="/actor/:id" element={<Actor />}   />
            <Route path="/agent/:id" element={<Agent />}   />
        </Routes>
    )
}
