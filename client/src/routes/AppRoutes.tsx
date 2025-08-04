import { Routes, Route } from "react-router-dom"

import { ActorPage } from "../pages/ActorsPage"
import { Actor } from "../components/Actor"
import { GenderEnum } from "../types/enums"
import HomePage from "../pages/HomePage"
import { AgentPage } from "../pages/AgentPage"
import { Agent } from "../components/Agent"


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/actors" element={ <ActorPage /> } />
            <Route path="/agents" element={ <AgentPage />} />
            <Route path="/actor/:id" element={<Actor />}   />
            <Route path="/agent/:id" element={<Agent />}   />
        </Routes>
    )
}
