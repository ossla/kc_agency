import { Link } from "react-router-dom"
import { IShortActor } from "../api/types/actorTypes";


interface ICardProps {
    actor: IShortActor
}

export default function Card(props: ICardProps) {
    return (
        <Link to={`/actors/${props.actor.id}`} className="card_main">
            <img className="card_avatar" src={props.actor.avatarUrl} alt={`${props.actor.firstName} ${props.actor.lastName}`} />
            <h1 className="card_name">
                {props.actor.firstName} {props.actor.lastName}
            </h1>
        </Link>
    );
}
