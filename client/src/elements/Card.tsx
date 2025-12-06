import { Link } from "react-router-dom"
import { IShortActor } from "../api/types/actorTypes";
import { IShortEmployee } from "../api/types/employeeTypes";
import { ACTORS, EMPLOYEES } from "../routes";

interface ICardProps {
    person: IShortActor | IShortEmployee
    isActor: boolean;
}

export default function Card(props: ICardProps) {
    
    return (
        <Link to={`${props.isActor ? ACTORS : EMPLOYEES}/${props.person.id}`} className="card_main">
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
                    <img className="card_video_icon" src="/video-icon.png" alt="Video Icon" />
                </div>
            </div>
        </Link>
    )
}
