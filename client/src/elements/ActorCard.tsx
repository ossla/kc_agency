import { useNavigate } from "react-router-dom"
import { useState } from "react";

import { IShortActor } from "../models/IActor";


export interface ActorCardProps {
    shortActor: IShortActor
}
export function ActorCard(props: ActorCardProps) {
    const [actor] = useState<IShortActor>(props.shortActor) 
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/actor/${actor.id}`)
    }

    return (
        <div onClick={handleClick} style={{cursor: 'pointer'}}>
            <img 
                src={actor.avatarUrl}              
                alt={`${actor.firstName} ${actor.lastName}`} 
                style={{ width: "200px", borderRadius: "8px" }}
            />
            <h1>{actor.firstName} {actor.lastName}</h1>
        </div>
    )
}