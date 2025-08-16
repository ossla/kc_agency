import { Link } from "react-router-dom";

interface CardProps {
    firstName: string;
    lastName: string;
    imgURL: string;
    id: number | string;
}

export default function Card(props: CardProps) {
    return (
        <Link to={`${props.id}`} className="card_main">
            <img className="card_avatar" src={props.imgURL} alt={`${props.firstName} ${props.lastName}`} />
            <h1 className="card_name">
                {props.firstName} {props.lastName}
            </h1>
        </Link>
    );
}
