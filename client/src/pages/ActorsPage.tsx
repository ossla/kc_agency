import { Suspense, use, useActionState, useEffect, useState } from "react"
import { IActor, IShortActor } from "../interfaces/IActor"
import Filters from "../elements/Filters"
import Card from "../elements/Card"
import fetchActors from "../api/fetchActors"
import "../styles/Page.css"
import { FilterActorType } from "../types/actorTypes"


export default function ActorsPage(props: any) {
    const [actors, setActors] = useState<IShortActor[]>([])
    const [isFiltered, setIsFiltered] = useState<boolean>(false)

    useEffect(() => {
        async function load() {
            const data: IShortActor[] = await fetchActors.getShort()
            setActors(data)
        }
        load()
    }, [])

    const handleFiltersChange = async (filters: FilterActorType) => {
        setIsFiltered(true)
        setActors(await fetchActors.filterActor(filters))
    }

    if (actors.length === 0 && !isFiltered) {
        return <img src="loading.gif" />
    }

    return (
        <>
            <Filters setFilters={handleFiltersChange} />

            <div className="page_cards">
                {actors.length !== 0 ?
                    actors.map((actor) => (
                        <Card
                            key={actor.id}
                            id={actor.id}
                            firstName={actor.firstName}
                            lastName={actor.lastName}
                            imgURL={actor.avatarUrl}
                        />
                    )) 
                    : 
                    <p>Ничего не найдено!</p>
                    }
            </div>
        </>
    )

}
