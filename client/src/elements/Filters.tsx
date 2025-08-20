import { useState } from "react";
import { FilterActorType } from "../types/actorTypes";
import { GenderEnum } from "../types/enums";


interface FiltersProps {
    setFilters: (filters: FilterActorType) => void;
}

export default function Filters(props: FiltersProps) {
    const [localFilters, setLocalFilters] = useState<FilterActorType>({})

    const handleChange = <K extends keyof FilterActorType>(
        field: K,
        value: FilterActorType[K]
    ) => {
        setLocalFilters((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <div>
            <p>Поиск: </p>
            <input
                type="text"
                placeholder="ФИО"
                onChange={(e) => handleChange("search", e.target.value)}
            />

            <p>Возраст: </p>
            <input
                type="number"
                placeholder="Мин. возраст"
                value={localFilters.minAge}
                onChange={(e) => handleChange("minAge", Number(e.target.value))}
            />
            <input
                type="number"
                placeholder="Макс. возраст"
                value={localFilters.maxAge}
                onChange={(e) => handleChange("maxAge", Number(e.target.value))}
            />

            <p>Рост: </p>
            <input
                type="number"
                placeholder="Мин. рост"
                value={localFilters.minHeight}
                onChange={(e) => handleChange("minHeight", Number(e.target.value))}
            />
            <input
                type="number"
                placeholder="Макс. возраст"
                value={localFilters.maxHeight}
                onChange={(e) => handleChange("maxHeight", Number(e.target.value))}
            />

            <button onClick={() => props.setFilters(localFilters)}>применить</button>
        </div>
    )
}