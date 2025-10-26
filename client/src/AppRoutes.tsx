import { Routes, Route } from "react-router-dom"

import NotFound from "./elements/NotFound"
import { ACTOR, ACTORS, AGENT, AGENTS, LOGIN, REGISTRATION } from "./routes"
import ActorsList from "./pages/ActorsList"
import Actor from "./pages/Actor"
import Login from "./pages/Login"
import Registration from "./pages/Registration"


export default function AppRoutes() {
    return (
        <Routes>
            <Route path={ACTORS} element={ < ActorsList /> } />
            <Route path={ACTOR} element={ < Actor /> } />
            {/* <Route path={AGENTS} element={ < ActorPage /> } />
            <Route path={AGENT} element={ < ActorPage /> } /> */}
            
            <Route path={REGISTRATION} element={ < Registration /> } />
            <Route path={LOGIN} element={ < Login /> } />

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
