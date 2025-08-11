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

                <select
                    multiple
                    value={filters.cityIds.map(String)}
                    onChange={e =>
                        handleFilterChange(
                            "cityIds",
                            Array.from(e.target.selectedOptions, o => Number(o.value))
                        )
                    }
                    className="border px-2 py-1 w-full"
                >
                    {cities.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    multiple
                    value={filters.eyeIds.map(String)}
                    onChange={e =>
                        handleFilterChange(
                            "eyeIds",
                            Array.from(e.target.selectedOptions, o => Number(o.value))
                        )
                    }
                    className="border px-2 py-1 w-full"
                >
                    {eyeColors.map(ec => (
                        <option key={ec.id} value={ec.id}>
                            {ec.name}
                        </option>
                    ))}
                </select>

                <select
                    multiple
                    value={filters.languageIds.map(String)}
                    onChange={e =>
                        handleFilterChange(
                            "languageIds",
                            Array.from(e.target.selectedOptions, o => Number(o.value))
                        )
                    }
                    className="border px-2 py-1 w-full"
                >
                    {languages.map(l => (
                        <option key={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>

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
