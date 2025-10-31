import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import Loading from "../elements/Loading"
import Card from "../elements/Card"
import fetchFavorites from "../api/fetchFavorites"
import { IShortActor } from "../api/types/actorTypes"
import AgentAdmin from "./AgentAdmin"
import { Link } from "react-router-dom"


export default function User() {
    const { user, accessToken } = useUser()
    const [ favorites, setFavorites ] = useState<IShortActor[] | null>(null)

    useEffect(() => {
        console.log(user)
        async function initFavorites() {
            if (user && accessToken) {
                setFavorites(await fetchFavorites.get(user.id, accessToken))
            } else if (user === null) {
                setFavorites([])
            }
        }

        initFavorites()
    }, [user, accessToken])

    return (
        <div className="container">
            {user ?
                <div>
                    <h1>{user.name}</h1>
                    <h1>{user.email}</h1>
                    <br />
                    <h1>Избранное:</h1>
                    {
                        favorites ?
                        <div>
                            {favorites.map((actor, idx) => <Card person={actor} isActor={true} key={idx} />)}
                        </div>
                        :
                        <Loading />
                    }
                    {
                        user.isAdmin &&
                        <div style={{"display": "flex", "flexDirection": "column", "marginTop": 10, "borderTop": "1px solid black"}}>
                            <Link to="/agent_admin_panel/">Создать агента</Link>
                            <Link to="/actor_admin_panel/">Создать актера</Link>
                        </div>
                    }
                </div>
                :
                <h1>Пользователь не найден!</h1>
            }
        </div>
    )
}