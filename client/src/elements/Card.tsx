import { useState } from "react";
import { Link } from "react-router-dom";
import { IShortActor } from "../api/types/actorTypes";
import { IShortEmployee } from "../api/types/employeeTypes";
import { ACTORS, EMPLOYEES } from "../routes";

interface ICardProps {
  person: IShortActor | IShortEmployee;
  isActor: boolean;
  videoUrl?: string; // URL YouTube для видео
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
        to={`${props.isActor ? ACTORS : EMPLOYEES}/${props.person.id}`}
        className="card_main"
      >
        <div className="card_image_wrapper">
          <img
            className="card_avatar"
            src={props.person.avatarUrl}
            alt={`${props.person.firstName} ${props.person.lastName}`}
          />
          <div className="card_overlay">
            <h1 className="card_name_overlay">
              {props.person.firstName} {props.person.lastName}
            </h1>
            <img
              className="card_video_icon"
              src="/video-icon.png"
              alt="Video Icon"
              onClick={openVideo}
            />
          </div>
        </div>
      </Link>

      {isVideoOpen && (
        <div className="video_modal" onClick={closeVideo}>
          <div
            className="video_modal_content"
            onClick={(e) => e.stopPropagation()}
          >
            
            <iframe
                width="720"
                height="405"
                src="https://rutube.ru/play/embed/599a9d86449fd170f1a2db5434fe8660"
                style={{border: "none"}}
                allow="clipboard-write; autoplay"
                allowFullScreen
            ></iframe>
            <button className="video_modal_close" onClick={closeVideo}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
