import { useEffect, useState } from "react"

import "../styles/Admin.css"
import fetchAuth from "../api/fetchAuth"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { GenderEnum } from "../api/types/enums"
import fetchActors from "../api/fetchActors"
import { ICity, IEyeColor, ILanguage } from "../api/types/relevantTypes"
import fetchRelevant from "../api/fetchRelevant"
import fetchAgents from "../api/fetchAgents"
import { IShortAgent } from "../api/types/agentTypes"


export default function ActorAdmin() {
    const { accessToken } = useUser()
    const navigator = useNavigate()

    const [firstName, setFirstName] = useState<string>()
    const [lastName, setLastName] = useState<string>()
    const [dateOfbirth, setDateOfbirth] = useState<Date>()
    const [gender, setGender] = useState<GenderEnum>()
    const [avatar, setAvatar] = useState<File>()
    const [photos, setPhotos] = useState<File[]>()
    
    const [middleName, setMiddleName] = useState<string>()

    const [agentId, setAgentId] = useState<string>()
    const [loadedAgents, setLoadedAgents] = useState<IShortAgent[]>([])

    const [city, setCity] = useState<string>()
    const [loadedCities, setLoadedCities] = useState<ICity[]>([])

    const [eyeColor, setEyeColor] = useState<string>()
    const [loadedEyeColors, setLoadedEyeColors] = useState<IEyeColor[]>([])

    const [languages, setLanguages] = useState<string>()
    const [loadedLanguages, setLoadedLanguages] = useState<ILanguage[]>([])

    const [height, setHeight] = useState<string>()
    const [clothesSize, setClothesSize] = useState<string>()


    const uploadAvatar = (event: React.FormEvent) => {
        const files = (event.target as HTMLInputElement).files

        if (files && files.length > 0) {
            setAvatar(files[0])
        }
    }

    const uploadPhotos = (event: React.FormEvent) => {
        const files = (event.target as HTMLInputElement).files

        if (files && files.length > 0) {
            // Преобразуем FileList в массив
            const filesArray = Array.from(files)
            setPhotos(filesArray)
        }
    }

    useEffect(() => {
        async function f() {
            setLoadedCities(await fetchRelevant.getCities())
            setLoadedEyeColors(await fetchRelevant.getEyeColors())
            setLoadedLanguages(await fetchRelevant.getLanguages())
            setLoadedAgents(await fetchAgents.getShort())
        }
        f()
    }, [])

    const createClick = async () => {
        if (firstName && lastName && agentId && gender && avatar) {
            const reqFormData: FormData = new FormData()

            reqFormData.append("firstName", firstName)
            reqFormData.append("lastName", lastName)
            reqFormData.append("agentId", agentId)
            reqFormData.append("gender", gender)
            reqFormData.append("avatar", avatar)
            // необязательные поля
            if (dateOfbirth) reqFormData.append("dateOfBirth", dateOfbirth.toDateString())
            if (eyeColor) reqFormData.append("eyeColor", eyeColor)
            if (middleName) reqFormData.append("middleName", middleName)
            if (city) reqFormData.append("city", city)

            await fetchAuth.auth()
            if (!accessToken) {
                throw new Error("Авторизуйтесь")
            }
            await fetchActors.create(accessToken, reqFormData)
            navigator("/agents/")

        } else {
            throw new Error("Необходимо заполнить все обязательные поля!")
        }
    }

    return (
        <div className="container">
            <div className="admin">
                <h1>Админ-актёр</h1>
                <label htmlFor="avatar">Аватар актёра*</label>
                <input type="file" id="avatar" placeholder="Загрузите аватар" onChange={uploadAvatar} />

                <label htmlFor="photos">Фото актёра*</label>
                <input 
                    type="file" 
                    id="photos" 
                    placeholder="Загрузите фото"
                    onChange={uploadPhotos} 
                    multiple 
                />

                <label htmlFor="firstName">Имя*</label>
                <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Имя" />

                <label htmlFor="lastName">Фамилия*</label>
                <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Фамилия" />

                <label htmlFor="middleName">Отчество</label>
                <input type="text" id="middleName" value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="Отчетство" />

                <label htmlFor="dateOfBirth">Дата рождения*</label>
                <input type="date" defaultValue="1980-01-01" />

                <label htmlFor="gender">Пол*</label>
                <div id="gender" className="gender-selector">
                    <button
                        className={gender === GenderEnum.man ? "selected" : ""}
                        onClick={() => setGender(GenderEnum.man)}
                    >
                        Мужской
                    </button>
                    <button
                        className={gender === GenderEnum.woman ? "selected" : ""}
                        onClick={() => setGender(GenderEnum.woman)}
                    >
                        Женский
                    </button>
                </div>

                <label htmlFor="eyeColor">Описание / доп. данные</label>
                <textarea id="eyeColor" value={eyeColor} onChange={e => setEyeColor(e.target.value)} placeholder="описание..." />


                {/* ===== City ===== */}
                <label htmlFor="city-list">Агент*</label>
                <input
                    list="city-list"
                    value={city}
                    onChange={e => setAgentId(e.target.value)}
                    placeholder="Начните вводить имя агента..."
                />
                <datalist id="city-list">
                    {loadedAgents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                            {agent.firstName + " " + agent.lastName}
                        </option>
                    ))}
                </datalist>

                {/* ===== City ===== */}
                <label htmlFor="city-list">Город</label>
                <input
                    list="city-list"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Введите город..."
                />
                <datalist id="city-list">
                    {loadedCities.map((c) => (
                        <option key={c.id} value={c.name} />
                    ))}
                </datalist>

                {/* ===== Eye Color ===== */}
                <label htmlFor="color-list">Цвет глаз</label>  
                <input
                    list="color-list"
                    value={eyeColor}
                    onChange={e => setEyeColor(e.target.value)}
                    placeholder="Введите цвет глаз..."
                />
                <datalist id="color-list">
                    {loadedEyeColors.map((color) => (
                        <option key={color.id} value={color.name} />
                    ))}
                </datalist>

                {/* ===== Languages ===== */}
                <label htmlFor="languages">Выберите языки</label>
                <select
                    id="languages"
                    multiple
                    value={languages ? languages.split(",") : []}
                    onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value)
                        setLanguages(selected.join(","))
                    }}
                >
                    {loadedLanguages.map((l) => (
                        <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                </select>

                <button onClick={createClick}>Создать актёра</button>
            </div>
        </div>
    )
}

// async function createAgent(newAgent: CreateAgentType) {

// } 