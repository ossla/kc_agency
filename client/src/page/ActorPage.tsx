import { useEffect, useState } from "react"
import fetchActors from "../data/fetchActors"
import { IActor } from "../model/IActor"
import { Actor } from "../component/Actor"


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
                    <Actor key={actor.id} actor={actor} />
            )) : (
                <p>Loading...</p>
            )}
        </div>
    )
}