import { useEffect, useState } from "react"
import Filters from "../elements/Filters"
import Card from "../elements/Card"
import fetchActors from "../api/fetchActors"
import "../styles/Page.css"
import { FilterActorType, IShortActor } from "../api/types/actorTypes"
import Loading from "../elements/Loading"
import { GenderEnum } from "../api/types/enums"


interface ActorListProps {
    gender: GenderEnum;
}

export default function ActorsList(props: ActorListProps) {
    const [actors, setActors] = useState<IShortActor[]>([])
    const [isFiltered, setIsFiltered] = useState<boolean>(false)

    useEffect(() => {
        async function load() {
            const data: IShortActor[] = await fetchActors.getShortByGender(props.gender)
            setActors(data)
        }
        load()

    }, [props.gender])

    const handleFiltersChange = async (filters: FilterActorType) => {
        setIsFiltered(true)
        filters.gender = props.gender
        setActors(await fetchActors.filterActor(filters))
    }

    if (actors.length === 0 && !isFiltered) {
        return <Loading />
    }

    return (
        <>
            <Filters setFilters={handleFiltersChange} />

            <div className="page_cards">
                {actors.length !== 0 &&
                    actors.map((actor, idx) => <Card person={actor} isActor={true} key={idx} />) 
                }
            </div>
        </>
    )

}
