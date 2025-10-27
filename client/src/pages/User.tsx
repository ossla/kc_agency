import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import Loading from "../elements/Loading"
import { Favorites } from "../api/types/userTypes"
import Card from "../elements/Card"


export default function User() {
    const { user } = useUser()
    const [ favorites, setFavorites ] = useState<Favorites[] | null>(null)

    useEffect(() => {

    }, [])

    return (
        <div>
            {user ?
                <div>
                    <h1>{user.name}</h1>
                    <h1>{user.email}</h1>
                    <br />
                    <h1>Избранное:</h1>
                    {
                        favorites ?
                        <div>
                            {favorites.map(f =>
                                <Card firstName={f.firstName} lastName={f.lastName} imgURL={f.imgURL} id={f.id}/>
                            )}
                        </div>
                        :
                        <Loading />
                    }
                </div>
                :
                <h1>Пользователь не найден!</h1>
            }
        </div>
    )
}