import { useEffect, useState } from "react";
import { IActor } from "../models/IActor";
import { IActorCardProps } from "./IActorProps";
import { useNavigate } from "react-router-dom"


export function ActorCard(props: IActorCardProps) {
    const [actor] = useState<IActor>(props.actor) 
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/actor/${actor.id}`)
    }

    return (
        <div onClick={handleClick} style={{cursor: 'pointer'}}>
            <img 
                src={actor.avatarUrl} 
                alt={`${actor.first_name} ${actor.last_name}`} 
                style={{ width: "200px", borderRadius: "8px" }}
                
            />
            <h1>{actor.first_name} {actor.last_name}</h1>
        </div>
    )
}