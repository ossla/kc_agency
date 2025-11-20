import { Routes, Route } from "react-router-dom"

import NotFound from "./elements/NotFound"
import { ACTOR, ACTOR_ADMIN, ACTORS_MEN, ACTORS_WOMEN, AGENT, AGENT_ADMIN, HOME, LOGIN, PROFILE, REGISTRATION } from "./routes"
import ActorsList from "./pages/ActorsList"
import Actor from "./pages/Actor"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import User from "./pages/User"
import AgentsList from "./pages/HomePage"
import AgentAdmin from "./pages/AgentAdmin"
import Agent from "./pages/Agent"
import ActorAdmin from "./pages/ActorAdmin"
import { GenderEnum } from "./api/types/enums"
import HomePage from "./pages/HomePage"


export default function AppRoutes() {
    return (
        <Routes>
            <Route path={ACTORS_MEN} element={ < ActorsList gender={GenderEnum.man} /> } />
            <Route path={ACTORS_WOMEN} element={ < ActorsList gender={GenderEnum.woman} /> } />
            <Route path={HOME} element={ < HomePage /> } />

            <Route path={ACTOR} element={ < Actor /> } />
            <Route path={AGENT} element={ < Agent /> } />
            
            <Route path={REGISTRATION} element={ < Registration /> } />
            <Route path={LOGIN} element={ < Login /> } />
            <Route path={PROFILE} element={ < User /> } />

            <Route path={AGENT_ADMIN} element={ < AgentAdmin /> } />
            <Route path={ACTOR_ADMIN} element={ < ActorAdmin /> } />
            
            <Route path="/" element={<AgentsList />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
