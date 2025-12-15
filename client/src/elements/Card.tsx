import { useState } from "react";
import { Link } from "react-router-dom";
import { IShortActor } from "../api/types/actorTypes";
import { ACTORS, EMPLOYEES } from "../routes";

interface ICardProps {
    actor: IShortActor;
    isActor: boolean;
}

export default function Card(props: ICardProps) {
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const openVideo = (e: React.MouseEvent) => {
        e.preventDefault(); // чтобы не срабатывал переход по <Link>
        e.stopPropagation(); // чтобы не срабатывали hover эффекты родителя
        setIsVideoOpen(true);
    };

    const closeVideo = () => setIsVideoOpen(false);

    return (
        <>
        <Link
            to={`${props.isActor ? ACTORS : EMPLOYEES}/${props.actor.id}`}
            className="card_main"
        >
            <div className="card_image_wrapper">
            <img
                className="card_avatar"
                src={props.actor.avatarUrl}
                alt={`${props.actor.firstName} ${props.actor.lastName}`}
            />
            <div className="card_overlay">
                <h1 className="card_name_overlay">
                {props.actor.firstName} {props.actor.lastName}
                </h1>

                {props.actor.videoURL &&
                    <img
                        className="card_video_icon"
                        src="/icons/video-icon.png"
                        alt="Video Icon"
                        onClick={openVideo}
                    />
                }
            </div>
            </div>
        </Link>

        {isVideoOpen && 
            (
            <div className="video_modal" onClick={closeVideo}>
            <div
                className="video_modal_content"
                onClick={(e) => e.stopPropagation()}
            >
                <iframe
                    width="720"
                    height="405"
                    src={props.actor.videoURL}
                    style={{border: "none"}}
                    allow="clipboard-write; autoplay"
                    allowFullScreen
                ></iframe>
                <button className="video_modal_close" onClick={closeVideo}>
                ×
                </button>
            </div>
            </div>
        )
        }
        </>
    );
}
