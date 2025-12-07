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
              src="/video-icon.svg"
              alt="Video Icon"
              onClick={openVideo}
            />
          </div>
        </div>
      </Link>

      {/* Модальное окно для видео */}
      {isVideoOpen && (
        <div className="video_modal" onClick={closeVideo}>
          <div
            className="video_modal_content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="800"
              height="450"
              src={props.videoUrl}
              title="Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
