import { useEffect, useState } from "react"
import Filters from "../elements/Filters"
import Card from "../elements/Card"
import fetchActors from "../api/fetchActors"
import { FilterActorType, IShortActor } from "../api/types/actorTypes"
import Loading from "../elements/Loading"
import { GenderEnum } from "../api/types/enums"
import "../styles/Cards.css"

interface ActorListProps {
    gender: GenderEnum;
}

export default function ActorsList(props: ActorListProps) {
    const [actors, setActors] = useState<IShortActor[]>([])
    const [isFiltered, setIsFiltered] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                const data: IShortActor[] = await fetchActors.getShortByGender(props.gender)
                setActors(data)
            } catch(e) {
                setError("что-то пошло не так")
            }
        }
        load()

    }, [props.gender])

    const handleFiltersChange = async (filters: FilterActorType) => {
        setIsFiltered(true)
        filters.gender = props.gender
        setActors(await fetchActors.filterActor(filters))
    }

    if (error) {
        return <h1>{error}</h1>
    }

    if (actors.length === 0 && !isFiltered) {
        return <p>Актёры не загружены</p>
    }

    const test = [
        {"id":14324,"firstName":"ads","lastName":"Actor","directory":"adsActor","avatarUrl":"http://localhost:3001/testActor/avatar.jpg"},
        {"id":231234,"firstName":"ads","lastName":"Actor","directory":"adsActor","avatarUrl":"http://localhost:3001/testActor/avatar.jpg"},
        {"id":123,"firstName":"ads","lastName":"Actor","directory":"adsActor","avatarUrl":"http://localhost:3001/testActor/avatar.jpg"},
    ]

    return (
        <>
            <Filters setFilters={handleFiltersChange} />

            <div className="page_cards">
                {test.length !== 0 &&
                    test.map((actor, idx) => <Card actor={actor} isActor={true} key={idx} />)
                }
                {actors.length !== 0 &&
                    actors.map((actor, idx) => <Card actor={actor} isActor={true} key={idx} />) 
                }
            </div>
        </>
    )

}
