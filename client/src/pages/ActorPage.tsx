import { useEffect, useState } from "react"
import fetchActors from "../data/fetchActors"
import { ActorCard } from "../elements/ActorCard"
import { GenderEnum } from "../types/enums";
import { IShortActor } from "../models/IShortActor";


interface IActorPage {
    gender: GenderEnum;
}

export function ActorPage(props: IActorPage) {

    const [actors, setActors] = useState<IShortActor[]>([])

    useEffect(() => {
        async function get() {
            setActors(await fetchActors.getShort(props.gender))
        }
        get()
    }, [])

    return (
        <div>
            {actors ? (
                actors.map(actor => 
                    <ActorCard key={actor.id} shortActor={actor}/>
            )) : (
                <p>Loading...</p>
            )}
        </div>
    )
}