import { Routes, Route } from "react-router-dom"

import NotFound from "./elements/NotFound"
import { ACTOR, ACTOR_ADMIN, ACTORS_MEN, ACTORS_WOMEN, EMPLOYEE, EMPLOYEE_ADMIN, HOME, LOGIN, PROFILE, REGISTRATION } from "./routes"
import ActorsList from "./pages/ActorsList"
import Actor from "./pages/Actor"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import User from "./pages/User"
import EmployeeAdmin from "./pages/EmployeeAdmin"
import ActorAdmin from "./pages/ActorAdmin"
import { GenderEnum } from "./api/types/enums"
import HomePage from "./pages/HomePage"
import Employee from "./pages/Employee"


export default function AppRoutes() {
    return (
        <Routes>
            <Route path={ACTORS_MEN} element={ < ActorsList gender={GenderEnum.man} /> } />
            <Route path={ACTORS_WOMEN} element={ < ActorsList gender={GenderEnum.woman} /> } />

            <Route path={ACTOR} element={ < Actor /> } />
            <Route path={EMPLOYEE} element={ < Employee /> } />
            
            <Route path={REGISTRATION} element={ < Registration /> } />
            <Route path={LOGIN} element={ < Login /> } />
            <Route path={PROFILE} element={ < User /> } />

            <Route path={EMPLOYEE_ADMIN} element={ < EmployeeAdmin /> } />
            <Route path={ACTOR_ADMIN} element={ < ActorAdmin /> } />
            
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
