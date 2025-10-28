import { Routes, Route } from "react-router-dom"

import NotFound from "./elements/NotFound"
import { ACTOR, ACTOR_ADMIN, ACTORS, AGENT, AGENT_ADMIN, AGENTS, LOGIN, PROFILE, REGISTRATION } from "./routes"
import ActorsList from "./pages/ActorsList"
import Actor from "./pages/Actor"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import User from "./pages/User"
import AgentsList from "./pages/AgentsList"
import AgentAdmin from "./pages/AgentAdmin"
import Agent from "./pages/Agent"


export default function AppRoutes() {
    return (
        <Routes>
            <Route path={ACTORS} element={ < ActorsList /> } />
            <Route path={AGENTS} element={ < AgentsList /> } />

            <Route path={ACTOR} element={ < Actor /> } />
            <Route path={AGENT} element={ < Agent /> } />
            
            <Route path={REGISTRATION} element={ < Registration /> } />
            <Route path={LOGIN} element={ < Login /> } />
            <Route path={PROFILE} element={ < User /> } />

            <Route path={AGENT_ADMIN} element={ < AgentAdmin /> } />
            
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
