import { useState } from "react";
import { FilterActorType } from "../types/actorTypes";



interface FiltersProps {
    filters: FilterActorType;
    onChange: (filters: FilterActorType) => void;
}

export default function Filters(props: FiltersProps) {
    
    const [localFilters, setLocalFilters] = useState(props.filters);

    const handleChange = (field: keyof FilterActorType, value: any) => {
        const updated = { ...localFilters, [field]: value };
        setLocalFilters(updated);
        props.onChange(updated); // уведомляем родителя
    };

    return (
        <div>
            <input
                type="number"
                placeholder="Мин. возраст"
            />
            <input
                type="number"
                placeholder="Макс. возраст"
            />
            {/* добавь остальные фильтры */}
        </div>
    )
}