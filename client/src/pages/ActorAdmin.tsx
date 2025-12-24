import { useEffect, useState } from "react"

import "../styles/Admin.css"
import fetchAuth from "../api/fetchAuth"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { GenderEnum } from "../api/types/enums"
import fetchActors from "../api/fetchActors"
import { ICity, IEyeColor, ILanguage } from "../api/types/relevantTypes"
import fetchRelevant from "../api/fetchRelevant"
import fetchEmployees from "../api/fetchEmployees"
import { IShortEmployee } from "../api/types/employeeTypes"
import ImageCropper from "../utils/ImageCropper"
import { ACTORS, ACTORS_MEN, ACTORS_WOMEN } from "../routes"


export default function ActorAdmin() {
    const { accessToken } = useUser()
    const navigator = useNavigate()

    const [error, setError] = useState<string>()
    const [isError, setIsError] = useState<boolean>()

    // basic data
    const [firstName, setFirstName] = useState<string>()
    const [lastName, setLastName] = useState<string>()
    const [dateOfbirth, setDateOfbirth] = useState<Date>(new Date("1992-01-01"))
    const [gender, setGender] = useState<GenderEnum>()

    const [height, setHeight] = useState<string>()
    const [videoURL, setVideoURL] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [education, setEducation] = useState<string>()
    const [middleName, setMiddleName] = useState<string>()
    const [skills, setSkills] = useState<string[]>([])
    const [linkToKinoTeatr, setLinkToKinoTeatr] = useState<string>()
    const [linkToFilmTools, setLinkToFilmTools] = useState<string>()
    const [linkToKinopoisk, setLinkToKinopoisk] = useState<string>()
    
    // files
    const [avatar, setAvatar] = useState<File>()
    const [tempAvatar, setTempAvatar] = useState<File>()
    const [photos, setPhotos] = useState<File[]>([])

    // relations
    const [employeeId, setEmployeeId] = useState<string>()
    const [loadedEmployees, setLoadedEmployees] = useState<IShortEmployee[]>([])

    const [eyeColor, setEyeColor] = useState<string>()
    const [loadedEyeColors, setLoadedEyeColors] = useState<IEyeColor[]>([])

    const [hairColor, setHairColor] = useState<string>()
    const [loadedHairColors, setLoadedHairColors] = useState<IEyeColor[]>([])

    const [city, setCity] = useState<string>()
    const [loadedCities, setLoadedCities] = useState<ICity[]>([])

    const [languages, setLanguages] = useState<string[]>([])
    const [loadedLanguages, setLoadedLanguages] = useState<ILanguage[]>([])


    const uploadAvatar = (event: React.FormEvent) => {
        const files = (event.target as HTMLInputElement).files

        if (files && files.length > 0) {
            setTempAvatar(files[0])
        }
    }

    const uploadPhotos = (event: React.FormEvent) => {
        const files = (event.target as HTMLInputElement).files

        if (files && files.length > 0) {
            const filesArray = Array.from(files)
            setPhotos(filesArray)
        }
    }

    const handleSelectLanguage = (languageName: string) => {
        setLanguages(prev => {
            if (!prev.includes(languageName)) {
                return [...prev, languageName]
            }
            return prev
        })
    }
    const handleAddNewLanguage = (newLanguage: string) => {
        const trimmed = newLanguage.trim()
        if (!trimmed) return

        setLanguages(prev => {
            if (!prev.includes(trimmed)) {
                return [...prev, trimmed]
            }
            return prev
        })
    }
    const handleRemoveLanguage = (languageName: string) => {
        setLanguages(prev => prev.filter(l => l !== languageName))
    }


    const handleAddNewSkill = (newSkill: string) => {
        const trimmed = newSkill.trim()
        if (!trimmed) return

        setSkills(prev => {
            if (!prev.includes(trimmed)) {
                return [...prev, trimmed]
            }
            return prev
        })
    }
    const handleRemoveSkill = (skillName: string) => {
        setSkills(prev => prev.filter(l => l !== skillName))
    }

    useEffect(() => {
        async function f() {
            setLoadedCities(await fetchRelevant.getCities())
            setLoadedEyeColors(await fetchRelevant.getEyeColors())
            setLoadedLanguages(await fetchRelevant.getLanguages())
            setLoadedEmployees(await fetchEmployees.getShort())
            setLoadedHairColors(await fetchRelevant.getHairColors())
        }
        f()
    }, [])

    const createClick = async () => {
        const fields = [
            { value: firstName, label: 'Имя' },
            { value: lastName, label: 'Фамилия' },
            { value: dateOfbirth, label: 'Дата рождения' },
            { value: gender, label: 'Пол' },
            { value: height, label: 'Рост' },
            { value: skills, label: 'Навыки' },
            { value: employeeId, label: 'ID сотрудника' },
            { value: eyeColor, label: 'Цвет глаз' },
            { value: hairColor, label: 'Цвет волос' },
            { value: city, label: 'Город' },
            { value: languages, label: 'Языки' },
            { value: avatar, label: 'Аватар' },
        ]

        const emptyField = fields.find(f => !f.value)

        if (emptyField) {
            setIsError(true)
            setError(`Поле "${emptyField.label}" обязательно для заполнения`)
            return
        }

        if (photos.length === 0) {
            setIsError(true)
            setError('Поле "Фотографии" не должно быть пустым')
            return
        }

        setIsError(false)

        const reqFormData = new FormData()

        reqFormData.append("firstName", firstName!)
        reqFormData.append("lastName", lastName!)
        reqFormData.append("dateOfBirth", dateOfbirth.toDateString())
        reqFormData.append("gender", gender!)
        reqFormData.append("height", height!)
        reqFormData.append("skills", JSON.stringify(skills))
        reqFormData.append("employeeId", employeeId!)
        reqFormData.append("eyeColor", eyeColor!)
        reqFormData.append("hairColor", hairColor!)
        reqFormData.append("city", city!)
        reqFormData.append("languages", JSON.stringify(languages))
        reqFormData.append("avatar", avatar!)

        Array.from(photos).forEach(file => {
            reqFormData.append("photos", file)
        })

        if (middleName) reqFormData.append("middleName", middleName)
        if (videoURL) reqFormData.append("videoURL", videoURL)
        if (description) reqFormData.append("description", description)
        if (education) reqFormData.append("education", education)
        if (linkToKinoTeatr) reqFormData.append("linkToKinoTeatr", linkToKinoTeatr)
        if (linkToFilmTools) reqFormData.append("linkToFilmTools", linkToFilmTools)
        if (linkToKinopoisk) reqFormData.append("linkToKinopoisk", linkToKinopoisk)

        await fetchAuth.auth()
        if (!accessToken) {
            setIsError(true)
            setError("Авторизуйтесь")
            return
        }

        await fetchActors.create(accessToken, reqFormData)
        navigator(gender === GenderEnum.man ? ACTORS_MEN : ACTORS_WOMEN)
    }


    return (
        <div className="container">
            <div className="admin">
                <h1>Создание актёра</h1>

                <>
                    <label htmlFor="avatar">Аватар*</label>
                    <input type="file" onChange={uploadAvatar} />

                    {tempAvatar && (
                    <ImageCropper
                        imageFile={tempAvatar}
                        aspect={4 / 5}
                        onCropped={(cropped) => {
                        setAvatar(cropped);
                        setTempAvatar(undefined);
                        }}
                        onCancel={() => setTempAvatar(undefined)}
                    />
                    )}
                </>

                <label htmlFor="photos">Фотогалерея*</label>
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
                <input type="date" onChange={(e) => setDateOfbirth(new Date(e.target.value))} />

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

                <label htmlFor="height">Рост*</label>
                <input type="number" id="height" value={height} onChange={e => setHeight(e.target.value)} placeholder="Рост" />

                <>
                    <label htmlFor="">Навыки*</label>
                    <input 
                        type="text"
                        placeholder="Добавить навык"
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleAddNewSkill(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                    <p>Выбранные навыки:</p>
                    <ul>
                        {skills.map(skill => (
                        <li key={skill}>
                            {skill}
                            <button onClick={() => handleRemoveSkill(skill)}>×</button>
                        </li>
                        ))}
                    </ul>
                </>

                {/* связи с другими таблицами (relations) */}
                <>
                    <label>Агент*</label>
                    {loadedEmployees.map((employee) => (
                        <div key={employee.id} className="employee-choice">
                            <input
                                type="radio"
                                id={`employee-${employee.id}`}
                                name="employee"
                                value={employee.id}
                                checked={employeeId === employee.id.toString()}
                                onChange={(e) => setEmployeeId(e.target.value)}
                            />
                            <p>
                                {employee.firstName} {employee.lastName}
                            </p>
                        </div>
                    ))}
                </>

                <>
                    <label htmlFor="color-list">Цвет глаз*</label> 
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
                </>

                <>
                    <label htmlFor="color-list">Натуральный цвет волос*</label> 
                    <input
                        list="color-list"
                        value={hairColor}
                        onChange={e => setHairColor(e.target.value)}
                        placeholder="Введите цвет волос..."
                        />
                    <datalist id="color-list">
                        {loadedHairColors.map((color) => (
                            <option key={color.id} value={color.name} />
                        ))}
                    </datalist>
                </>

                <>
                    <label htmlFor="city-list">Город*</label>
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
                </>

                <div id="languages" className="languages">
                    <label htmlFor="languages">Языки*</label>
                    {loadedLanguages.map(lang => (
                        <button
                            key={lang.id}
                            onClick={() => handleSelectLanguage(lang.name)}
                            style={{ margin: 4, background: languages.includes(lang.name) ? 'lightblue' : 'white' }}
                        >
                            {lang.name}
                        </button>
                    ))}

                    <input
                        type="text"
                        placeholder="Добавить новый язык"
                        onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleAddNewLanguage(e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                        }}
                    />

                    <p>Выбранные языки:</p>
                    <ul>
                        {languages.map(lang => (
                        <li key={lang}>
                            {lang}
                            <button onClick={() => handleRemoveLanguage(lang)}>×</button>
                        </li>
                        ))}
                    </ul>
                </div>

                {/* необязательные поля, кроме отчесчтва middleName */}
                <>
                    <label htmlFor="videoURL">Ссылка embed на видео RUTUBE</label>
                    <img src="/instructions/videoURL_1.png" style={{width: "300px"}}/>
                    <img src="/instructions/videoURL_2.png" style={{width: "500px"}}/>
                    <input type="text" id="videoURL" value={videoURL} onChange={e => setVideoURL(e.target.value)} placeholder="Ссылка на видео" />
                </>

                <label htmlFor="description">Описание / доп. данные</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание" />

                <label htmlFor="education">Образование</label>
                <p>«Учебное заведение» - специальность, год</p>
                <input type="text" id="education" value={education} onChange={e => setEducation(e.target.value)} placeholder="Образование" />

                <label htmlFor="linkToKinopoisk">Ссылка на kinopoisk</label>
                <input type="text" id="linkToKinopoisk" value={linkToKinopoisk} onChange={e => setLinkToKinopoisk(e.target.value)} placeholder="Ссылка" />

                <label htmlFor="linkToFilmTools">Ссылка на filmtoolz</label>
                <input type="text" id="linkToFilmTools" value={linkToFilmTools} onChange={e => setLinkToFilmTools(e.target.value)} placeholder="Ссылка" />

                <label htmlFor="linkToKinoTeatr">Ссылка на kino-teatr</label>
                <input type="text" id="linkToKinoTeatr" value={linkToKinoTeatr} onChange={e => setLinkToKinoTeatr(e.target.value)} placeholder="Ссылка" />

                {
                    isError &&
                    <p className="error">{error}</p>
                }

                <button onClick={createClick}>Создать актёра</button>
            </div>
        </div>
    )
}


