import { Link } from "react-router-dom"
import { IShortActor } from "../api/types/actorTypes";
import { IShortEmployee } from "../api/types/employeeTypes";
import { ACTORS, EMPLOYEES, HOME } from "../routes";


interface ICardProps {
    person: IShortActor | IShortEmployee
    isActor: boolean;
}

export default function Card(props: ICardProps) {
    return (
        <Link to={(props.isActor ? ACTORS : EMPLOYEES) + "/" + props.person.id} className="card_main">
            <img className="card_avatar" src={props.person.avatarUrl} alt={`${props.person.firstName} ${props.person.lastName}`} />
            <h1 className="card_name">
                {props.person.firstName} {props.person.lastName}
            </h1>
        </Link>
    )
}