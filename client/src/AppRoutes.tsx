import { Routes, Route } from "react-router-dom"

import ActorsPage from "./pages/ActorsPage"
import NotFound from "./pages/NotFoundPage"


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/actors" element={ < ActorsPage /> } />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
