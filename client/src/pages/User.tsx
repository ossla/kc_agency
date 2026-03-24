import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import fetchFavorites from "../api/fetchFavorites"
import { IShortActor } from "../api/types/actorTypes"
import { Link } from "react-router-dom"
import { ACTOR_ADMIN, EMPLOYEE_ADMIN } from "../routes"
import "../styles/Main.css"


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
                    {/* <h1>Избранное:</h1>
                    {
                        favorites ?
                        <div>
                            {favorites.map((actor, idx) => <Card showVideo={true} actor={actor} key={idx} />)}
                        </div>
                        :
                        <Loading />
                    } */}
                    {
                        user.isAdmin &&
                        <div style={{"display": "flex", "flexDirection": "column", "marginTop": 10, "borderTop": "1px solid black"}}>
                            <button className="btn"><Link to={EMPLOYEE_ADMIN}>Создать агента</Link></button>
                            <button className="btn"><Link to={ACTOR_ADMIN}>Создать актера</Link></button>
                        </div>
                    }
                </div>
                :
                <h1>Пользователь не найден!</h1>
            }
        </div>
    )
}