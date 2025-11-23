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


export default function ActorAdmin() {
    const { accessToken } = useUser()
    const navigator = useNavigate()

    // basic data
    const [firstName, setFirstName] = useState<string>()
    const [lastName, setLastName] = useState<string>()
    const [dateOfbirth, setDateOfbirth] = useState<Date>(new Date("1992-01-01"))
    const [gender, setGender] = useState<GenderEnum>()
    const [height, setHeight] = useState<string>()
    const [clothesSize, setClothesSize] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [middleName, setMiddleName] = useState<string>()

    // files
    const [avatar, setAvatar] = useState<File>()
    const [tempAvatar, setTempAvatar] = useState<File>()
    const [photos, setPhotos] = useState<File[]>([])

    // relations
    const [employeeId, setEmployeeId] = useState<string>()
    const [loadedEmployees, setLoadedEmployees] = useState<IShortEmployee[]>([])

    const [city, setCity] = useState<string>()
    const [loadedCities, setLoadedCities] = useState<ICity[]>([])

    const [eyeColor, setEyeColor] = useState<string>()
    const [loadedEyeColors, setLoadedEyeColors] = useState<IEyeColor[]>([])

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


    useEffect(() => {
        async function f() {
            setLoadedCities(await fetchRelevant.getCities())
            setLoadedEyeColors(await fetchRelevant.getEyeColors())
            setLoadedLanguages(await fetchRelevant.getLanguages())
            setLoadedEmployees(await fetchEmployees.getShort())
        }
        f()
    }, [])


    const createClick = async () => {
        if (firstName && lastName && employeeId && gender && dateOfbirth && avatar && photos.length != 0) {
            const reqFormData: FormData = new FormData()

            reqFormData.append("firstName", firstName)
            reqFormData.append("lastName", lastName)
            reqFormData.append("employeeId", employeeId)
            reqFormData.append("gender", gender)
            reqFormData.append("dateOfBirth", dateOfbirth.toDateString())
            reqFormData.append("avatar", avatar)
            Array.from(photos).forEach((file) => {
                reqFormData.append("photos", file)
            })

            // необязательные поля
            if (height) reqFormData.append("height", height)
            if (clothesSize) reqFormData.append("clothesSize", clothesSize)
            if (eyeColor) reqFormData.append("eyeColor", eyeColor)
            if (city) reqFormData.append("city", city)
            if (languages) {
                reqFormData.append("languages", JSON.stringify(languages))
            }

            await fetchAuth.auth()
            if (!accessToken) {
                throw new Error("Авторизуйтесь")
            }
            await fetchActors.create(accessToken, reqFormData)
            navigator("/actors/")

        } else {
            throw new Error("Необходимо заполнить все обязательные поля!")
        }
    }

    return (
        <div className="container">
            <div className="admin">
                <h1>Админ-актёр</h1>

                <label htmlFor="avatar">Аватар актёра*</label>
                <>
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

                {/* ===== Agent ===== */}
                <label>Агент*</label>
                <div className="employee-radio-group">
                    {loadedEmployees.map((employee) => (
                        <div key={employee.id} className="radio-option">
                            <input
                                type="radio"
                                id={`employee-${employee.id}`}
                                name="employee"
                                value={employee.id}
                                checked={employeeId === employee.id.toString()}
                                onChange={(e) => setEmployeeId(e.target.value)}
                            />
                            <label htmlFor={`employee-${employee.id}`}>
                                {employee.firstName} {employee.lastName}
                            </label>
                        </div>
                    ))}
                </div>
                
                <label htmlFor="height">Рост</label>
                <input type="number" id="height" value={height} onChange={e => setHeight(e.target.value)} placeholder="Рост" />

                <label htmlFor="clothesSize">Размер одежды</label>
                <input type="number" id="clothesSize" value={clothesSize} onChange={e => setClothesSize(e.target.value)} placeholder="Размер одежды" />

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
                <div id="languages" className="languages">
                    <label htmlFor="languages">Языки</label>
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

                <label htmlFor="description">Описание / доп. данные</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание" />

                <button onClick={createClick}>Создать актёра</button>
            </div>
        </div>
    )
}