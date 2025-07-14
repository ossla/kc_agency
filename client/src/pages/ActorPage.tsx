import { useEffect, useState } from "react"
import fetchActors from "../data/fetchActors"
import { IActor } from "../models/IActor"
import { ActorCard } from "../elements/ActorCard"


export function ActorPage(props: any) {

    const [actorData, setActorData] = useState<IActor[]>([])

    useEffect(() => {
        async function get() {
            const actors: IActor[] = await fetchActors.getActors()            
            setActorData(actors)
        }
        get()
    }, [])

    return (
        <div>
            {actorData ? (
                actorData.map(actor => 
                    <ActorCard key={actor.id} actor={actor} />
            )) : (
                <p>Loading...</p>
            )}
        </div>
    )
}