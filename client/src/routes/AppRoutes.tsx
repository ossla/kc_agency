import { Routes, Route } from "react-router-dom"

import { ActorPage } from "../pages/ActorsPage"
import { Actor } from "../components/Actor"
import { GenderEnum } from "../types/enums"
import HomePage from "../pages/HomePage"
import { AgentPage } from "../pages/AgentPage"


export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/men" element={   <ActorPage gender={GenderEnum.man}   />} />
            <Route path="/women" element={ <ActorPage gender={GenderEnum.woman} />} />
            <Route path="/agents" element={ <AgentPage />} />
            <Route path="/actor/:id" element={<Actor />} />
        </Routes>
    )
}
