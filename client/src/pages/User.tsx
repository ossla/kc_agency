import { useEffect, useState } from "react"
import { useUser } from "../context/UserContext"
import Loading from "../elements/Loading"
import { Favorites } from "../api/types/userTypes"


export default function User() {
    const { user } = useUser()
    const [ favorites, setFavorites ] = useState<Favorites | null>(null)

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
                        <div></div>
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