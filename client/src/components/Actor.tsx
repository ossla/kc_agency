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


    if (!actor) return <p>Loading...</p>

    return (
        <div className="flex gap-8">
            <div className="flex flex-col items-start w-1/3">
                <img
                    src={`http://localhost:3001/${actor.directory}/avatar.jpg`}
                    alt={`${actor.firstName} ${actor.lastName}`}
                    className="w-64 h-80 object-cover rounded mb-4"
                />

                <div className="grid grid-cols-3 gap-2">
                    {actor.photos?.map((photo, i) => (
                        <img
                            key={i}
                            src={`http://localhost:3001/${actor.directory}/${photo}`}
                            alt={`Фото ${i + 1}`}
                            className="w-20 h-20 object-cover rounded"
                        />
                    ))}
                </div>
            </div>

            <div className="w-2/3">
                <h1 className="text-2xl font-bold mb-2">{actor.firstName} {actor.middleName} {actor.lastName}</h1>

                <ul className="space-y-1 text-sm">
                    <li><b>Пол:</b> {actor.gender}</li>
                    <li><b>Дата рождения:</b> {new Date(actor.dateOfBirth).toLocaleDateString()}</li>
                    {actor.height && <li><b>Рост:</b> {actor.height} см</li>}
                    {actor.clothesSize && <li><b>Размер одежды:</b> {actor.clothesSize}</li>}
                    {actor.eyeColor && <li><b>Цвет глаз:</b> {actor.eyeColor.name}</li>}
                    {actor.city && <li><b>Город:</b> {actor.city.name}</li>}
                    {actor.languages && actor.languages.length > 0 && (
                        <li><b>Языки:</b> {actor.languages.map(l => l.name).join(", ")}</li>
                    )}
                    {actor.linkToKinopoisk && (
                        <li><a href={actor.linkToKinopoisk} target="_blank" rel="noreferrer">Kinopoisk</a></li>
                    )}
                    {actor.linkToKinoTeatr && (
                        <li><a href={actor.linkToKinoTeatr} target="_blank" rel="noreferrer">Кинотеатр.ру</a></li>
                    )}
                    {actor.linkToFilmTools && (
                        <li><a href={actor.linkToFilmTools} target="_blank" rel="noreferrer">Filmtools</a></li>
                    )}
                    {actor.description && (
                        <li className="mt-2"><b>Описание:</b> <p>{actor.description}</p></li>
                    )}
                </ul>

                {
                    <iframe
                        width="720"
                        height="405"
                        src="https://rutube.ru/play/embed/3583b4b7416b485385c3253855487bfa"
                        frameBorder="0"
                        allow="clipboard-write; autoplay"
                        allowFullScreen
                    ></iframe>
                }

            </div>
        </div>
    )
}