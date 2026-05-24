import { useEffect, useState } from "react"

import "../styles/Admin.css"
import "../styles/Main.css"

import fetchAuth from "../api/fetchAuth"
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { GenderEnum } from "../api/types/enums"
import fetchActors from "../api/fetchActors"
import { ICity, IEyeColor, ILanguage } from "../api/types/relevantTypes"
import fetchRelevant from "../api/fetchRelevant"
import fetchEmployees from "../api/fetchEmployees"
import { IEmployee } from "../api/types/employeeTypes"
import ImageCropper from "../utils/ImageCropper"
import { ACTORS_MEN, ACTORS_WOMEN } from "../routes"
import { processError } from "../api/apiError"
import Loading from "../elements/Loading"
import TagEditor from "../elements/TagEditor"

const MAX_PHOTO_SIZE_MB = 8
const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024
const TOTAL_PHOTOS_WARNING_MB = 60
const TOTAL_PHOTOS_WARNING_BYTES = TOTAL_PHOTOS_WARNING_MB * 1024 * 1024
const LARGE_PHOTOS_WARNING = "Загрузка может занять много времени, пожалуйста, подождите или загрузите фото меньшего размера"

export default function ActorAdmin() {
    const { accessToken } = useUser()
    const navigator = useNavigate()

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

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
    const [photoWarning, setPhotoWarning] = useState<string | null>(null)

    // relations
    const [employeeId, setEmployeeId] = useState<string>()
    const [loadedEmployees, setLoadedEmployees] = useState<IEmployee[]>([])

    const [eyeColor, setEyeColor] = useState<string>()
    const [loadedEyeColors, setLoadedEyeColors] = useState<IEyeColor[]>([])

    const [hairColor, setHairColor] = useState<string>()
    const [loadedHairColors, setLoadedHairColors] = useState<IEyeColor[]>([])

    const [city, setCity] = useState<string>()
    const [loadedCities, setLoadedCities] = useState<ICity[]>([])

    const [languages, setLanguages] = useState<string[]>([])
    const [loadedLanguages, setLoadedLanguages] = useState<ILanguage[]>([])


    const uploadAvatar = (event: React.FormEvent) => {
        const input = event.target as HTMLInputElement
        const files = input.files

        if (files && files.length > 0) {
            if (files[0].size > MAX_PHOTO_SIZE_BYTES) {
                setError(`File size should be less than ${MAX_PHOTO_SIZE_MB} MB`)
                setTempAvatar(undefined)
                input.value = ""
                return
            }

            setTempAvatar(files[0])
            setError(null)
        }
    }

    const uploadPhotos = (event: React.FormEvent) => {
        const input = event.target as HTMLInputElement
        const files = input.files

        if (files && files.length > 0) {
            if (files.length > 20) {
                setError("не нужно грузить более 20 фото")
                setPhotos([])
                setPhotoWarning(null)
                input.value = ""
                return;
            }
            const filesArray = Array.from(files)
            const oversizedFile = filesArray.find(file => file.size > MAX_PHOTO_SIZE_BYTES)

            if (oversizedFile) {
                setError(`File "${oversizedFile.name}" should be less than ${MAX_PHOTO_SIZE_MB} MB`)
                setPhotos([])
                setPhotoWarning(null)
                input.value = ""
                return
            }

            const totalSize = filesArray.reduce((sum, file) => sum + file.size, 0)

            setPhotos(filesArray)
            setPhotoWarning(totalSize > TOTAL_PHOTOS_WARNING_BYTES ? LARGE_PHOTOS_WARNING : null)
            setError(null)
        }
    }

    useEffect(() => {
        async function f() {
            try {
                setLoadedCities(await fetchRelevant.getCities())
                setLoadedEyeColors(await fetchRelevant.getEyeColors())
                setLoadedLanguages(await fetchRelevant.getLanguages())
                setLoadedEmployees(await fetchEmployees.get())
                setLoadedHairColors(await fetchRelevant.getHairColors())
                
            } catch (e: unknown) {
                setError(processError(e))
            }
        }
        f()
    }, [])

    const createClick = async () => {
        if (isLoading) return

        setIsLoading(true)
        try {
            console.log("[createClick] старт создания актёра")

            const required_fields = [
                { value: firstName, label: 'Имя' },
                { value: lastName, label: 'Фамилия' },
                { value: dateOfbirth, label: 'Дата рождения' },
                { value: gender, label: 'Пол' },
                { value: height, label: 'Рост' },
                { value: employeeId, label: 'ID сотрудника' },
                { value: eyeColor, label: 'Цвет глаз' },
                { value: hairColor, label: 'Цвет волос' },
                { value: city, label: 'Город' },
                { value: avatar, label: 'Аватар' },
            ]

            const emptyField = required_fields.find(f => !f.value)
            if (emptyField) {
                console.error("[createClick] пустое обязательное поле:", emptyField.label)
                throw new Error(`Поле "${emptyField.label}" обязательно для заполнения`)
            }

            if (photos.length === 0) {
                console.error("[createClick] фотографии отсутствуют")
                throw new Error('Поле "Фотографии" не должно быть пустым')
            }

            setError(null)

            const reqFormData = new FormData()
            console.log("[createClick] формируем FormData")

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
            
            console.log("[createClick] прикрепляем фотографии:", photos)
            Array.from(photos).forEach(file => {
                reqFormData.append("photos", file)
                console.log("[createClick] добавлено фото:", file)
            })

            if (middleName) { reqFormData.append("middleName", middleName); console.log("[createClick] middleName:", middleName) }
            if (videoURL) { reqFormData.append("videoURL", videoURL); console.log("[createClick] videoURL:", videoURL) }
            if (description) { reqFormData.append("description", description); console.log("[createClick] description:", description) }
            if (education) { reqFormData.append("education", education); console.log("[createClick] education:", education) }
            if (linkToKinoTeatr) { reqFormData.append("linkToKinoTeatr", linkToKinoTeatr); console.log("[createClick] linkToKinoTeatr:", linkToKinoTeatr) }
            if (linkToFilmTools) { reqFormData.append("linkToFilmTools", linkToFilmTools); console.log("[createClick] linkToFilmTools:", linkToFilmTools) }
            if (linkToKinopoisk) { reqFormData.append("linkToKinopoisk", linkToKinopoisk); console.log("[createClick] linkToKinopoisk:", linkToKinopoisk) }

            console.log("[createClick] проверяем accessToken")
            await fetchAuth.auth()
            if (!accessToken) {
                console.error("[createClick] нет accessToken")
                throw new Error("Авторизуйтесь")
            }

            console.log("[createClick] отправка данных на сервер")
            await fetchActors.create(accessToken, reqFormData)

            console.log("[createClick] актёр успешно создан, перенаправление")
            navigator(gender === GenderEnum.man ? ACTORS_MEN : ACTORS_WOMEN)

        } catch (e: unknown) {
            setIsLoading(false)
            console.error("[createClick] ошибка:", e)
            setError(processError(e))
        }
    }


    return (
        <div className="container">
            <div className="admin">
                <h1>Создание актёра</h1>

                <>
                    <label htmlFor="avatar">Аватар*</label>
                    <input type="file" accept=".jpg,.jpeg,image/jpeg" onChange={uploadAvatar} />

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

                <label htmlFor="photos">Фотогалерея* (до 20 шт., файлы jpeg, jpg)</label>
                <input 
                    type="file" 
                    id="photos"
                    placeholder="Загрузите фото"
                    accept=".jpg,.jpeg,image/jpeg"
                    onChange={uploadPhotos}
                    multiple 
                />
                {photoWarning && <p className="error">{photoWarning}</p>}

                <label htmlFor="lastName">Фамилия*</label>
                <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Фамилия" />

                <label htmlFor="firstName">Имя*</label>
                <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Имя" />

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

                <TagEditor
                    label="Навыки"
                    values={skills}
                    onChange={setSkills}
                    placeholder="Боевые искусства, игра на скрипке, жанглирование..."
                />

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
                    <label htmlFor="color-list">Цвет глаз* (оставьте значение в поле)</label> 
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
                    <label htmlFor="color-list">Натуральный цвет волос* (оставьте значение в поле)</label> 
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
                    <label htmlFor="city-list">Город* (оставьте значение в поле)</label>
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

                <TagEditor
                    label="Языки"
                    values={languages}
                    onChange={setLanguages}
                    suggestions={loadedLanguages.map(lang => lang.name)}
                    placeholder="Добавить язык"
                />

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
                    error !== null &&
                    <p className="error">{error}</p>
                }

                <button onClick={createClick} disabled={isLoading}>
                    {isLoading ? "Сохраняем..." : "Создать актёра"}
                </button>
                {isLoading && <Loading />}
            </div>
        </div>
    )
}


