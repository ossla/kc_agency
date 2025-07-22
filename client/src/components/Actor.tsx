import { useEffect, useState } from "react"

import fetchActors from "../data/fetchActors"
import { IActor } from "../models/IActor"
import { useParams } from "react-router-dom"
import { GenderEnum } from "../types/enums"
import Album from "../elements/AlbumPhotos"
import AlbumPhotos from "../elements/AlbumPhotos"


export function Actor() {
    const [actor, setActor] = useState<IActor>()
    // const [links, setLinks] = useState<ILinks>()

    const { id } = useParams<{ id: string }>()
    
    
    useEffect(() => {
        async function get() {
            const data: IActor = await fetchActors.getActor(Number(id))
            setActor(data)
        }
        get()
    })

    return (
        <div>
            {actor ?
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "20px" }}>
                <img
                    src={`http://localhost:3001/${actor.directory}/avatar.jpg`}
                    alt={`${actor.firstName} ${actor.lastName}`}
                    style={{ width: "200px", borderRadius: "8px", objectFit: "cover" }}
                />
                <AlbumPhotos photos={actor.photos}/>

                <div>
                    <h2 style={{ margin: 0 }}>{actor.firstName} {actor.middleName ?? ""} {actor.lastName}</h2>
                    <p>Пол: {actor.gender === GenderEnum.man ? "Мужской" : "Женский"}</p>
                    <p>Дата рождения: {new Date(actor.dateOfBirth).toLocaleDateString()}</p>
                    {actor.height && <p>Рост: {actor.height} см</p>}
                    {actor.clothesSize && <p>Размер одежды: {actor.clothesSize}</p>}
                    {actor.eyeColor && <p>Цвет глаз: {actor.eyeColor.name}</p>}
                    {actor.city && <p>Город: {actor.city.name}</p>}
                    {actor.languages && actor.languages.length > 0 && (
                        <p>Языки: {actor.languages.map(lang => lang.name).join(", ")}</p>
                    )}
                    {actor.description && <p>{actor.description}</p>}

                    {actor.linkToKinopoisk && (
                        <p>
                            <a href={actor.linkToKinopoisk} target="_blank" rel="noopener noreferrer">
                                Kinopoisk
                            </a>
                        </p>
                    )}
                    {actor.linkToKinoTeatr && (
                        <p>
                            <a href={actor.linkToKinoTeatr} target="_blank" rel="noopener noreferrer">
                                Kino-Teatr.ru
                            </a>
                        </p>
                    )}
                    {actor.linkToFilmTools && (
                        <p>
                            <a href={actor.linkToFilmTools} target="_blank" rel="noopener noreferrer">
                                FilmTools
                            </a>
                        </p>
                    )}
                </div>
            </div>
            :
            <p>Loading...</p>}
        </div>
    )
}