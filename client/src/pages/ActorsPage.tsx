import { useEffect, useState } from "react"
import fetchActors from "../data/fetchActors"
import { ActorCard } from "../elements/ActorCard"
import { GenderEnum } from "../types/enums";
import { IShortActor } from "../models/IActor";


// interface ActorPageProps {
//     gender: GenderEnum;
// }

// interface IFilters {
//     agent,
//     minAge,
//     maxAge,
//     cities: ,
//     clothesSize: number
//     eyeColors: string[]
// }

export function ActorPage(props: any) {

    const [actors, setActors] = useState<IShortActor[]>([])

    useEffect(() => {
        async function get() {
            setActors(await fetchActors.getShort())
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