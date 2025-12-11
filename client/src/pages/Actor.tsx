import React, { useEffect, useState } from "react";
import "../styles/Actor.css";
import { IActor } from "../api/types/actorTypes";
import { useParams } from "react-router-dom";
import fetchActors from "../api/fetchActors";
import Loading from "../elements/Loading";
import { ILanguage } from "../api/types/relevantTypes";


export default function ActorPage() {

    const { id } = useParams()
    const [actor, setActor] = useState<IActor>()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                setActor(await fetchActors.getActor(Number(id)));
            } catch {
                setError("Не удалось загрузить актёра");
            }
        };
        loadData();
    }, []);

    if (!actor) return <Loading />;
    if (error) return <h1>{error}</h1>;

    return (
        <div className="actor_page_wrapper">
            <div className="actor_grid">
            
                {/* Левая часть===================================== */}
                <div className="actor_left">
                    <img
                        className="actor_avatar"
                        src={actor.url + "/avatar.jpg"}
                        alt="avatar"
                    />

                    <div className="floating_block">
                        {actor.languages && (
                            <div className="actor_block">
                                <h3 className="actor_block_title">Языки</h3>
                                <ul>
                                    {actor.languages.map((l: ILanguage) => (
                                        <li key={l.id}>{l.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {actor.skills && (
                            <div className="actor_block">
                                <h3 className="actor_block_title">Навыки</h3>
                                <ul>
                                    {actor.skills.map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Правая часть===================================== */}
                <div className="actor_right">
                    <div className="floating_block">
                        <h1 className="actor_fio">
                            {actor.lastName} {actor.firstName} {actor.middleName}
                        </h1>

                        <div className="actor_parameters">
                            {actor.dateOfBirth && (
                                <p>Дата рождения: {actor.dateOfBirth.toString()}</p>
                            )}
                            {actor.height && <p>Рост: {actor.height} см</p>}
                            {actor.description && <p>{actor.description}</p>}
                        </div>
                        {actor.education && (
                            <div className="actor_block">
                                <h2 className="actor_section_title">Образование</h2>
                                <p>{actor.education}</p>
                            </div>
                        )}
                    </div>

                    <div className="floating_block">
                        <iframe
                            width="720"
                            height="405"
                            src={actor.videoURL}
                            style={{ border: "none" }}
                            allow="autoplay; fullscreen"
                        ></iframe>

                        <div className="actor_block">
                            <h2 className="actor_section_title">Фотогалерея</h2>

                            <div className="actor_gallery">
                                {actor.photos.map((p, i) => (
                                    <img
                                        key={i}
                                        src={actor.url + "/" + p}
                                        className="actor_gallery_photo"
                                        alt="gallery"
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
