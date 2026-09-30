import { useEffect, useState } from "react"
import Filters from "../elements/Filters"
import Card from "../elements/Card"
import fetchActors from "../api/fetchActors"
import { FilterActorType, IShortActor } from "../api/types/actorTypes"
import Loading from "../elements/Loading"
import { GenderEnum } from "../api/types/enums"
import "../styles/Person.css"
import { useUser } from "../context/UserContext"
import ActorOrderEditor from "../elements/ActorOrderEditor"

interface ActorListProps {
    gender: GenderEnum;
}

export default function ActorsList(props: ActorListProps) {
    const { user, accessToken } = useUser()
    const [ordering, setOrdering] = useState(false)
    const [revision, setRevision] = useState(0)
    const [actors, setActors] = useState<IShortActor[]>([])
    const [isFiltered, setIsFiltered] = useState<boolean>(false)

    const [error, setError] = useState<string | null>(null)
    const [loading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        let cancelled = false
        setOrdering(false)
        setIsLoading(true)
        setError(null)
        setIsFiltered(false)
        async function load() {
            try {
                const data: IShortActor[] = await fetchActors.getShortByGender(props.gender)
                if (cancelled) return
                setIsLoading(false)
                setActors(data)
            } catch(e) {
                if (cancelled) return
                setError("что-то пошло не так")
            }
        }
        load()
        return () => { cancelled = true }

    }, [props.gender, revision])

    const handleFiltersChange = async (filters: FilterActorType) => {
        setIsFiltered(true)
        filters.gender = props.gender
        setActors(await fetchActors.filterActor(filters))
    }

    if (ordering && user?.isAdmin && accessToken) {
        return <ActorOrderEditor key={props.gender} gender={props.gender} token={accessToken}
            onClose={() => { setOrdering(false); setRevision(value => value + 1) }} />
    }

    if (error) {
        return <h1>{error}</h1>
    }

    if (loading) {
        return <Loading />
    }

    if (actors.length === 0 && !isFiltered) {
        return <h1>Актёров не найдено.</h1>
    }

    return (
        <>
            {user?.isAdmin && <div className="container"><button className="btn" onClick={() => setOrdering(true)}>Изменить порядок</button></div>}
            <Filters key={`${props.gender}-${revision}`} setFilters={handleFiltersChange} />

            <div className="page_cards">
                {actors.length !== 0 &&
                    actors.map(actor => <Card actor={actor} key={actor.id} showVideo={true} />)
                }
            </div>
        </>
    )

}
