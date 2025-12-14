import React, { useEffect, useState } from "react";
import "../styles/Actor.css";
import { IActor } from "../api/types/actorTypes";
import { useParams } from "react-router-dom";
import fetchActors from "../api/fetchActors";
import Loading from "../elements/Loading";
import { ILanguage } from "../api/types/relevantTypes";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";


export default function ActorPage() {

    const { id } = useParams()
    const [actor, setActor] = useState<IActor>()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                setActor(await fetchActors.getActor(Number(id)))
            } catch {
                setError("Не удалось загрузить актёра")
            }
        };
        loadData()
    }, []);

    if (error) return <h1>{error}</h1>
    if (!actor) return <Loading />    

    return (
        <div className="actor_page_wrapper">
            <div className="actor_grid">
            
                {/* Левая часть===================================== */}
                <div className="actor_left">
                    <PhotoProvider>
                        <PhotoView src={actor.url + "/avatar.jpg"}>
                            <img
                                className="actor_avatar"
                                src={actor.url + "/avatar.jpg"}
                                alt="avatar"
                            />
                        </PhotoView>
                    </PhotoProvider>

                    <div className="actor_actions">
                        {actor.linkToFilmTools && 
                            <a href={actor.linkToFilmTools}>
                                <img src="/icons/filmtoolz_icon.png" alt="icon2" />
                            </a>
                        }
                        {actor.linkToKinoTeatr && 
                            <a href={actor.linkToKinoTeatr}>
                                <img src="/icons/kinoteatr_icon.png" alt="icon3" />
                            </a>
                        }
                        {actor.linkToKinopoisk && 
                            <a href={actor.linkToKinopoisk}>
                                <img src="/icons/kinopoisk_icon.png" alt="icon1" />
                            </a>
                        }
                    </div>
                </div>

                {/* Правая часть===================================== */}
                <div className="actor_right">
                    <div className="floating_block">
                    <h1 className="actor_fio">
                        {actor.lastName} {actor.firstName} {actor.middleName}
                    </h1>

                    <div className="actor_parameters">
                        <div className="actor_param">
                            <h4>Дата рождения</h4>
                            <p>{actor.dateOfBirth.getFullYear()}.{actor.dateOfBirth.getMonth() + 1}.{actor.dateOfBirth.getDate()}</p>
                        </div>
                        <div className="actor_param">
                            <h4>Рост</h4>
                            <p>{actor.height} см</p>
                        </div>
                        <div className="actor_param">
                            <h4>Город</h4>
                            <p>{actor.city.name}</p>
                        </div>
                        <div className="actor_param">
                            <h4>Цвет глаз</h4>
                            <p>{actor.eyeColor.name}</p>
                        </div>
                        <div className="actor_param">
                            <h4>Натуральный цвет волос</h4>
                            <p>{actor.hairColor.name}</p>
                        </div>
                        
                        { actor.education &&
                            <div className="actor_param">
                                <h4 className="actor_section_title">Образование</h4>
                                <p>{actor.education}</p>
                            </div>
                        }
                    </div>
                    </div>


                    <div className="floating_block">
                    <div className="actor_block">
                        <p id="quote">❝</p>
                        <p>{actor.description}</p>
                    </div>
                    </div>

                    <div className="floating_block">
                        {actor.languages && (
                            <div className="actor_block">
                                <h3>Языки</h3>
                                <ul>
                                    {actor.languages.map((l: ILanguage) => (
                                        <li key={l.id}>{l.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="line"/>

                        {actor.skills && (
                            <div className="actor_block">
                                <h3>Навыки</h3>
                                <ul>
                                    {actor.skills.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="floating_block">
                    {actor.videoURL && (
                        <div className="actor_block">
                            <h3>Видеовизитка</h3>
                            <iframe
                                width="720"
                                height="405"
                                src={actor.videoURL}
                                style={{ border: "none" }}
                                allow="autoplay; fullscreen"
                            ></iframe>
                        </div>
                    )}

                    <div className="actor_block">
                        <h3>Фотогалерея</h3>
                        <PhotoProvider>
                            <div className="actor_gallery">
                                {actor.photos.map((p, i) => (
                                    <PhotoView
                                        key={i}
                                        src={actor.url + "/" + p}
                                    >
                                        <img
                                            src={actor.url + "/" + p}
                                            className="actor_gallery_photo"
                                            alt="gallery"
                                        />
                                    </PhotoView>
                                ))}
                            </div>
                        </PhotoProvider>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
