import { useEffect, useState } from "react"
import { ActorCard } from "../elements/ActorCard"
import { IShortActor } from "../models/IShortActor"


export function AgentPage() {

    const [actors, setActors] = useState<IShortActor[]>([])

    // useEffect(() => {
    //     async function get() {
    //         // setActors(await fetchActors.getShort(props.gender))
    //     }
    //     get()
    // }, [])

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