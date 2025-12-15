import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import "../styles/Admin.css"

import { useUser } from "../context/UserContext"
import fetchAuth from "../api/fetchAuth"
import fetchActors from "../api/fetchActors"
import fetchRelevant from "../api/fetchRelevant"
import fetchEmployees from "../api/fetchEmployees"

import { GenderEnum } from "../api/types/enums"
import { ICity, IEyeColor, ILanguage } from "../api/types/relevantTypes"
import { IShortEmployee } from "../api/types/employeeTypes"

import ImageCropper from "../utils/ImageCropper"
import { ACTORS_MEN, ACTORS_WOMEN } from "../routes"

export default function ActorAdminNew() {
    const { accessToken } = useUser()
    const navigate = useNavigate()

    /* обязательнне */
    const [firstName, setFirstName] = useState("")
    const [middleName, setMiddleName] = useState("")
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)
    const [gender, setGender] = useState<GenderEnum | null>(null)
    const [employeeId, setEmployeeId] = useState("")
    const [height, setHeight] = useState("")
    const [city, setCity] = useState("")
    const [eyeColor, setEyeColor] = useState("")
    const [hairColor, setHairColor] = useState("")
    const [languages, setLanguages] = useState<string[]>([])
    const [skills, setSkills] = useState<string[]>([])

    /* необязательные */
    const [videoURL, setVideoURL] = useState("")
    const [description, setDescription] = useState("")
    const [education, setEducation] = useState("")
    const [linkToKinoTeatr, setLinkToKinoTeatr] = useState("")
    const [linkToFilmTools, setLinkToFilmTools] = useState("")
    const [linkToKinopoisk, setLinkToKinopoisk] = useState("")

    /* файлы */
    const [avatar, setAvatar] = useState<File | null>(null)
    const [tempAvatar, setTempAvatar] = useState<File | null>(null)
    const [photos, setPhotos] = useState<File[]>([])

    /* связи с другими таблицами */
    const [loadedLanguages, setLoadedLanguages] = useState<ILanguage[]>([])
    const [employees, setEmployees] = useState<IShortEmployee[]>([])
    const [cities, setCities] = useState<ICity[]>([])
    const [eyeColors, setEyeColors] = useState<IEyeColor[]>([])
    const [hairColors, setHairColors] = useState<IEyeColor[]>([])
    const [languagesDict, setLanguagesDict] = useState<ILanguage[]>([])

    useEffect(() => {
        async function load() {
            setEmployees(await fetchEmployees.getShort())
            setCities(await fetchRelevant.getCities())
            setEyeColors(await fetchRelevant.getEyeColors())
            setHairColors(await fetchRelevant.getHairColors())
            setLanguagesDict(await fetchRelevant.getLanguages())
        }
        load()
    }, [])

    const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setTempAvatar(e.target.files[0])
        }
    }

    const uploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos(Array.from(e.target.files))
        }
    }

    const handleSelectLanguage = (name: string) => {
        setLanguages(prev =>
            prev.includes(name)
                ? prev.filter(l => l !== name)
                : [...prev, name]
        )
    }

    const handleAddNewLanguage = (value: string) => {
        const v = value.trim()
        if (!v) return

        setLanguages(prev => {
            if (prev.includes(v)) return prev
            return [...prev, v]
        })
    }

    const addSkill = (value: string) => {
        const v = value.trim()
        if (v && !skills.includes(v)) {
            setSkills(prev => [...prev, v])
        }
    }

    const removeSkill = (s: string) => {
        setSkills(prev => prev.filter(x => x !== s))
    }

    const createActor = async () => {
        if (
            !firstName ||
            !dateOfBirth ||
            !gender ||
            !employeeId ||
            !hairColor ||
            !city ||
            !eyeColor ||
            !height ||
            languages.length === 0 ||
            skills.length === 0 ||
            !avatar ||
            photos.length === 0
        ) {
            throw new Error("Не заполнены обязательные поля")
        }

        const fd = new FormData()

        fd.append("firstName", firstName)
        fd.append("middleName", middleName)
        fd.append("dateOfBirth", dateOfBirth.toISOString())
        fd.append("gender", gender)
        fd.append("employeeId", employeeId)
        fd.append("hairColor", hairColor)
        fd.append("city", city)
        fd.append("eyeColor", eyeColor)
        fd.append("height", height)
        fd.append("languages", JSON.stringify(languages))
        fd.append("skills", JSON.stringify(skills))
        fd.append("avatar", avatar)

        photos.forEach(p => fd.append("photos", p))

        if (videoURL) fd.append("videoURL", videoURL)
        if (description) fd.append("description", description)
        if (education) fd.append("education", education)
        if (linkToKinoTeatr) fd.append("linkToKinoTeatr", linkToKinoTeatr)
        if (linkToFilmTools) fd.append("linkToFilmTools", linkToFilmTools)
        if (linkToKinopoisk) fd.append("linkToKinopoisk", linkToKinopoisk)

        await fetchAuth.auth()
        if (!accessToken) throw new Error("Нет авторизации")

        await fetchActors.create(accessToken, fd)

        navigate(gender === GenderEnum.man ? ACTORS_MEN : ACTORS_WOMEN)
    }

    return (
        <div className="container">
            <div className="admin">
                <h1>Новый актёр</h1>

                <label>Аватар*</label>
                <input type="file" onChange={uploadAvatar} />
                {tempAvatar && (
                    <ImageCropper
                        imageFile={tempAvatar}
                        aspect={4 / 5}
                        onCropped={f => {
                            setAvatar(f)
                            setTempAvatar(null)
                        }}
                        onCancel={() => setTempAvatar(null)}
                    />
                )}

                <label>Фото*</label>
                <input type="file" multiple onChange={uploadPhotos} />

                <label>Имя*</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} />

                <label>Отчество</label>
                <input value={middleName} onChange={e => setMiddleName(e.target.value)} />

                <label>Дата рождения*</label>
                <input type="date" onChange={e => setDateOfBirth(new Date(e.target.value))} />

                <label>Пол*</label>
                <div className="gender-selector">
                    <button onClick={() => setGender(GenderEnum.man)} className={gender === GenderEnum.man ? "selected" : ""}>М</button>
                    <button onClick={() => setGender(GenderEnum.woman)} className={gender === GenderEnum.woman ? "selected" : ""}>Ж</button>
                </div>

                <label>Агент*</label>
                {employees.map(e => (
                    <label key={e.id}>
                        <input type="radio" value={e.id} checked={employeeId === String(e.id)} onChange={ev => setEmployeeId(ev.target.value)} />
                        {e.firstName} {e.lastName}
                    </label>
                ))}

                <label>Рост*</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} />

                <label>Город*</label>
                <input list="cities" value={city} onChange={e => setCity(e.target.value)} />
                <datalist id="cities">
                    {cities.map(c => <option key={c.id} value={c.name} />)}
                </datalist>

                <label>Цвет глаз*</label>
                <input list="eyes" value={eyeColor} onChange={e => setEyeColor(e.target.value)} />
                <datalist id="eyes">
                    {eyeColors.map(c => <option key={c.id} value={c.name} />)}
                </datalist>

                <label>Цвет волос*</label>
                <input value={hairColor} onChange={e => setHairColor(e.target.value)} />

                <label>Языки*</label>
                <div className="languages">
                    {loadedLanguages.map(lang => (
                        <button
                            key={lang.id}
                            type="button"
                            onClick={() => handleSelectLanguage(lang.name)}
                            className={languages.includes(lang.name) ? "selected" : ""}
                        >
                            {lang.name}
                        </button>
                    ))}

                    <input
                        type="text"
                        placeholder="Добавить новый язык"
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                handleAddNewLanguage(e.currentTarget.value)
                                e.currentTarget.value = ""
                            }
                        }}
                    />

                    {languages.length > 0 && (
                        <ul>
                            {languages.map(l => (
                                <li key={l}>
                                    {l}
                                    <button type="button" onClick={() => handleSelectLanguage(l)}>×</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <label>Навыки*</label>
                <input
                    placeholder="Enter — добавить"
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            addSkill(e.currentTarget.value)
                            e.currentTarget.value = ""
                        }
                    }}
                />
                <ul>
                    {skills.map(s => (
                        <li key={s}>
                            {s} <button onClick={() => removeSkill(s)}>×</button>
                        </li>
                    ))}
                </ul>

                <label>Видео</label>
                <input value={videoURL} onChange={e => setVideoURL(e.target.value)} />

                <label>Описание</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} />

                <label>Образование</label>
                <input value={education} onChange={e => setEducation(e.target.value)} />

                <label>Kino-Teatr</label>
                <input value={linkToKinoTeatr} onChange={e => setLinkToKinoTeatr(e.target.value)} />

                <label>FilmToolz</label>
                <input value={linkToFilmTools} onChange={e => setLinkToFilmTools(e.target.value)} />

                <label>Кинопоиск</label>
                <input value={linkToKinopoisk} onChange={e => setLinkToKinopoisk(e.target.value)} />

                <button onClick={createActor}>Создать</button>
            </div>
        </div>
    )
}
