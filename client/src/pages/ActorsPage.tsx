import React, { useEffect, useState } from "react"
import fetchActors from "../api/fetchActors" // твои функции filterActor, getCities и т.д.
import { GenderEnum } from "../types/enums"
import { IShortActor } from "../models/IActor"
import { ICity } from "../models/ICity"
import { IEyeColor } from "../models/IEyeColor"
import { ILanguage } from "../models/ILanguage"
import fetchRelevant from "../api/fetchRelevant"
import { ActorCard } from "../elements/ActorCard"

export function ActorsPage() {
    const [actors, setActors] = useState<IShortActor[]>([])
    const [cities, setCities] = useState<ICity[]>([])
    const [eyeColors, setEyeColors] = useState<IEyeColor[]>([])
    const [languages, setLanguages] = useState<ILanguage[]>([])

    const [filters, setFilters] = useState({
        search: "",
        cityIds: [] as number[],
        eyeIds: [] as number[],
        languageIds: [] as number[],
        gender: undefined as GenderEnum | undefined
    })

    useEffect(() => {
        async function loadFilters() {
            setCities(await fetchRelevant.getCities())
            setEyeColors(await fetchRelevant.getEyeColors())
            setLanguages(await fetchRelevant.getLanguages())
        }
        loadFilters()

        async function loadActors() {
            setActors(await fetchActors.getShort())
        }
        loadActors()
    }, [])

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleSearch = async () => {
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => {
                if (v == null) return false
                if (Array.isArray(v) && v.length === 0) return false
                if (typeof v === "string" && v.trim() === "") return false
                return true
            })
        )
        setActors(await fetchActors.filterActor(cleanedFilters))
    }

    return (
        <div className="p-4">
            <div className="mb-4 space-y-2">
                <input
                    type="text"
                    placeholder="Поиск"
                    value={filters.search}
                    onChange={e => handleFilterChange("search", e.target.value)}
                    className="border px-2 py-1 w-full"
                />

                {/* Города */}
                <div className="mb-4">
                {cities.map(c => (
                    <label key={c.id} className="inline-flex items-center mr-4">
                    <input
                        type="checkbox"
                        value={c.id}
                        checked={filters.cityIds.includes(c.id)}
                        onChange={e => {
                        const checked = e.target.checked;
                        let newCityIds;
                        if (checked) {
                            // добавляем id в массив
                            newCityIds = [...filters.cityIds, c.id];
                        } else {
                            // удаляем id из массива
                            newCityIds = filters.cityIds.filter(id => id !== c.id);
                        }
                        handleFilterChange("cityIds", newCityIds);
                        }}
                        className="mr-1"
                    />
                    {c.name}
                    </label>
                ))}
                </div>


                {/* Цвет глаз */}
                <div className="mb-4">
                {eyeColors.map(ec => (
                    <label key={ec.id} className="inline-flex items-center mr-4">
                    <input
                        type="checkbox"
                        value={ec.id}
                        checked={filters.eyeIds.includes(ec.id)}
                        onChange={e => {
                        const checked = e.target.checked;
                        let newEyeIds;
                        if (checked) {
                            newEyeIds = [...filters.eyeIds, ec.id];
                        } else {
                            newEyeIds = filters.eyeIds.filter(id => id !== ec.id);
                        }
                        handleFilterChange("eyeIds", newEyeIds);
                        }}
                        className="mr-1"
                    />
                    {ec.name}
                    </label>
                ))}
                </div>

                {/* Языки */}
                <div className="mb-4">
                {languages.map(l => (
                    <label key={l.id} className="inline-flex items-center mr-4">
                    <input
                        type="checkbox"
                        value={l.id}
                        checked={filters.languageIds.includes(l.id)}
                        onChange={e => {
                        const checked = e.target.checked;
                        let newLangIds;
                        if (checked) {
                            newLangIds = [...filters.languageIds, l.id];
                        } else {
                            newLangIds = filters.languageIds.filter(id => id !== l.id);
                        }
                        handleFilterChange("languageIds", newLangIds);
                        }}
                        className="mr-1"
                    />
                    {l.name}
                    </label>
                ))}
                </div>

                <select
                    value={filters.gender ?? ""}
                    onChange={e =>
                        handleFilterChange(
                            "gender",
                            e.target.value ? (e.target.value as GenderEnum) : undefined
                        )
                    }
                    className="border px-2 py-1 w-full"
                >
                    <option value="">Любой пол</option>
                    <option value={GenderEnum.man}>Мужской</option>
                    <option value={GenderEnum.woman}>Женский</option>
                </select>

                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                    Применить фильтры
                </button>
            </div>

            <div>
                {actors.length > 0 ? (
                    actors.map(actor => (
                        <ActorCard key={actor.id} shortActor={actor} />
                    ))
                ) : (
                    <p>Ничего не найдено</p>
                )}
            </div>
        </div>
    )
}
