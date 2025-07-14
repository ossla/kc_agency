import { useEffect, useState } from "react";
import { IActor } from "../model/IActor";
import { IActorProps } from "./interfaces/IActorProps";

export function Actor(props: IActorProps) {
    const [actor, setActor] = useState<IActor>(props.actor) 

    return (
        <div>
            
            <h1>{actor.first_name} {actor.last_name}</h1>
        </div>
    )
}