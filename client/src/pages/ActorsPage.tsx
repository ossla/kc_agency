import { Suspense, use, useActionState, useEffect, useState } from "react"
import { IActor, IShortActor } from "../interfaces/IActor"
import Filters from "../elements/Filters"
import Card from "../elements/Card"
import fetchActors from "../api/fetchActors"
import "../styles/Page.css"
import { FilterActorType } from "../types/actorTypes"


export default function ActorsPage(props: any) {
    const [actors, setActors] = useState<IShortActor[]>([]);
    const [filters, setFilters] = useState<FilterActorType>({});

    useEffect(() => {
        async function load() {
            const data: IShortActor[] = await fetchActors.getShort();
            setActors(data);
        }
        load();
    }, []); // ← не забыть зависимости, иначе будет бесконечный цикл

    // Функция, которую Filters будет вызывать при изменении фильтров
    const handleFiltersChange = (newFilters: FilterActorType) => {
        setFilters(newFilters);
    };

    const filteredActors = actors.filter(actor => {
        // пример фильтрации (условия — в зависимости от структуры FilterActorType)
        return true;
    });

    if (actors.length === 0) {
        return <img src="loading.gif" />;
    }

    return (
        <>
            <Filters filters={filters} onChange={handleFiltersChange} />

            <div className="page_cards">
                {filteredActors.map((actor) => (
                    <Card
                        key={actor.id}
                        id={actor.id}
                        firstName={actor.firstName}
                        lastName={actor.lastName}
                        imgURL={actor.avatarUrl}
                    />
                ))}
            </div>
        </>
    );

}
