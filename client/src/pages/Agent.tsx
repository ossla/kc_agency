import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import fetchActors from "../api/fetchActors"
import Loading from "../elements/Loading"
import { serverURL } from "../api/URLs"
import "../styles/Actor.css"
import "react-photo-view/dist/react-photo-view.css"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { IActor } from "../api/types/actorTypes"


export default function Agent() {
    const { id } = useParams()
    const [actor, setActor] = useState<IActor>()

    useEffect(() => {
        const loadData = async () => { setActor(await fetchActors.getActor(Number(id))) } 
        loadData()
    }, [])

    if (!actor) {
        return <Loading />
    }

    return (
        <div className="actor_container">
            <div className="actor_avatar_section">
                <PhotoProvider>
                    <PhotoView src={actor.url + "/avatar.jpg"}>
                        <img className="actor_avatar" src={actor.url + "/avatar.jpg"} />
                    </PhotoView>
                </PhotoProvider>
                <h1 className="actor_name">{actor.firstName} {actor.lastName}</h1>

                <div className="actor_album">
                    <PhotoProvider>
                        {actor.photos.map((p, idx) => 
                            <PhotoView key={idx} src={actor.url + '/' + p}>
                                <img className="actor_photo" src={actor.url + '/' + p}/>
                            </PhotoView>
                        )}
                    </PhotoProvider>
                </div>
            </div>

            <div className="actor_about_section">
                <table className="actor_table">
                    <tbody>
                        <tr>
                            <th>Фамилия</th>
                            <td>{actor.lastName}</td>
                        </tr>
                        <tr>
                            <th>Имя</th>
                            <td>{actor.firstName}</td>
                        </tr>
                        {actor.middleName && (
                            <tr>
                                <th>Отчество</th>
                                <td>{actor.middleName}</td>
                            </tr>
                        )}
                        <tr>
                            <th>Пол</th>
                            <td>{actor.gender}</td>
                        </tr>
                        <tr>
                            <th>Дата рождения</th>
                            <td>{new Date(actor.dateOfBirth).toLocaleDateString()}</td>
                        </tr>
                        {actor.height && (
                            <tr>
                                <th>Рост</th>
                                <td>{actor.height} см</td>
                            </tr>
                        )}
                        {actor.clothesSize && (
                            <tr>
                                <th>Размер одежды</th>
                                <td>{actor.clothesSize}</td>
                            </tr>
                        )}
                        {actor.city && (
                            <tr>
                                <th>Город</th>
                                <td>{actor.city.name}</td>
                            </tr>
                        )}
                        {actor.eyeColor && (
                            <tr>
                                <th>Цвет глаз</th>
                                <td>{actor.eyeColor.name}</td>
                            </tr>
                        )}
                        {actor.languages && actor.languages.length > 0 && (
                            <tr>
                                <th>Языки</th>
                                <td>{actor.languages.map(l => l.name).join(", ")}</td>
                            </tr>
                        )}
                        {actor.description && (
                            <tr>
                                <th>Описание</th>
                                <td>{actor.description}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
