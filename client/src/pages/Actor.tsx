import React, { useEffect, useState } from "react";
import "../styles/Actor.css";
import "../styles/Admin.css";
import { EditActorType, IActor, IShortActor } from "../api/types/actorTypes";
import { useNavigate, useParams } from "react-router-dom";
import fetchActors from "../api/fetchActors";
import Loading from "../elements/Loading";
import { ILanguage } from "../api/types/relevantTypes";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { processError } from "../api/apiError";
import { EmployeesList } from "./EmployeeList";
import { EmployeeCard } from "../elements/EmployeeCard";
import { useUser } from "../context/UserContext";
import { HOME } from "../routes";
import { IEmployee } from "../api/types/employeeTypes";
import fetchEmployees from "../api/fetchEmployees";
import fetchRelevant from "../api/fetchRelevant";


export default function ActorPage() {

    const { id } = useParams()
    const [actor, setActor] = useState<IActor>()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!id) throw "не указан id";
                setActor(await fetchActors.getActor(id))
            } catch(e: unknown) {
                setError(processError(e))
            }
        };
        loadData()
    }, []);

    // для эдита
    const { user, accessToken } = useUser()
    const [isEdit, setIsEdit] = useState(false)
    const [editData, setEditData] = useState<EditActorType | null>(null)
    const navigator = useNavigate()
    const [empls, setEmpls] = useState<IEmployee[] | null>()
    const [loadedLanguages, setLoadedLanguages] = useState<ILanguage[]>([])
    const [languages, setLanguages] = useState<string[]>([])
    const [skills, setSkills] = useState<string[]>([])
    
    const startEdit = async () => {
        if (!actor) return;

        setEditData({
            id: actor.id,
            firstName: actor.firstName,
            lastName: actor.lastName,
            dateOfBirth: actor.dateOfBirth,
            employeeId: actor.employee.id,

            middleName: actor.middleName,
            height: actor.height,
            gender: actor.gender,
            city: actor.city?.name,
            eyeColor: actor.eyeColor?.name,
            hairColor: actor.hairColor?.name,
            description: actor.description,
            videoURL: actor.videoURL,
            education: actor.education || "",
            skills: [],
            languages: []
        })

        setLanguages(actor.languages?.map(l => l.name))
        setSkills(actor.skills)
        setEmpls(await fetchEmployees.get())
        setLoadedLanguages(await fetchRelevant.getLanguages())

        setIsEdit(true);
    }

    const handleSave = async () => {
        if (!editData || !accessToken) return;

        {
            // Проверка обязательных полей на удаление в них данных
            const required_fields = [
                { value: editData.firstName, label: 'Имя' },
                { value: editData.lastName, label: 'Фамилия' },
                { value: editData.dateOfBirth, label: 'Дата рождения' },
                { value: editData.gender, label: 'Пол' },
                { value: editData.height, label: 'Рост' },
                { value: editData.employeeId, label: 'ID сотрудника' },
                { value: editData.eyeColor, label: 'Цвет глаз' },
                { value: editData.hairColor, label: 'Цвет волос' },
                { value: editData.city, label: 'Город' },
            ]
        
            const emptyField = required_fields.find(f => !f.value)
    
            if (emptyField) {
                setError(`Поле "${emptyField.label}" обязательно для заполнения`)
                return
            }
        }

        editData.languages = languages

        try {
            const formData = new FormData();

            Object.entries(editData).forEach(([key, value]) => {
                if (value === undefined || value === null) return

                if (Array.isArray(value)) {
                    value.forEach(v => formData.append(key, v))
                } else {
                    formData.append(key, value.toString())
                }
            })

            const updated = await fetchActors.editActor(accessToken, formData)

            setActor(updated)
            setIsEdit(false)
        } catch (e) {
            setError(processError(e));
        }
    }

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    }

    const handleDelete = async () => {
        if (!actor || !accessToken) return

        if (!window.confirm('Удалить актёра?')) return

        await fetchActors.deleteActor(accessToken, actor.id)

        navigator(HOME)
    }

    // языки
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
    // навыки
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

    if (!actor) return <Loading />    

    return (
        <div className="actor_page_wrapper">
            <div className="actor_grid">
            
                {/* Левая часть===================================== */}
                <div className="actor_left">
                    <PhotoProvider>
                        <PhotoView src={actor.url + "/avatar_1600.jpg"}>
                            <img
                                className="actor_avatar"
                                src={actor.url + "/avatar_400.jpg"}
                                alt="avatar"
                            />
                        </PhotoView>
                    </PhotoProvider>

                    <div className="actor_actions">
                        {actor.linkToFilmTools && 
                            <a href={actor.linkToFilmTools}>
                                <img src="/icons/filmtoolz_icon.png" alt="icon2" />
                            </a>
                        }
                        {actor.linkToKinoTeatr && 
                            <a href={actor.linkToKinoTeatr}>
                                <img src="/icons/kinoteatr_icon.png" alt="icon3" />
                            </a>
                        }
                        {actor.linkToKinopoisk && 
                            <a href={actor.linkToKinopoisk}>
                                <img src="/icons/kinopoisk_icon.png" alt="icon1" />
                            </a>
                        }
                    </div>
                </div>

                {/* Правая часть===================================== */}
                <div className="actor_right">
                    {error && <h1 style={{padding: '5px', backgroundColor: '#fda8a8'}}>{error}</h1>}
                    {user?.isAdmin && !isEdit && (
                        <div className="floating_block">
                        <div style={{ marginBottom: "10px" }}>
                            <button className="btn" onClick={startEdit}>Редактировать</button>
                            <button className="btn" onClick={handleDelete} style={{ marginLeft: "10px" }}>
                                Удалить
                            </button>
                        </div>
                        </div>
                    )}
                    {isEdit && <div style={{ marginTop: "10px" }}>
                                    <button className="btn" onClick={handleSave}>Сохранить</button>
                                    <button className="btn" onClick={() => setIsEdit(false)} style={{ marginLeft: "10px" }}>
                                        Отмена
                                    </button>
                                </div>
                    }

                    {isEdit && editData && 
                        <div className="actor_param">
                            <h4>Пол</h4>
                            <input  id="M" type="radio" checked={editData.gender === "M"} value="M" onChange={e => setEditData({ ...editData, gender: "M" })}/>
                            <label htmlFor="M">Мужчина</label>
                            <input id="W" type="radio" checked={editData.gender === "W"} value="W" onChange={e => setEditData({ ...editData, gender: "W" })}/>
                            <label htmlFor="W">Женщина</label>
                        </div>
                    }

                    <div className="floating_block">
                    {/** ФИО */}
                    {isEdit && editData ? (
                            <div>
                                <input
                                    className="edit_input"
                                    value={editData.firstName || ""}
                                    onChange={e => setEditData({ ...editData, firstName: e.target.value })}
                                    placeholder="Имя"
                                />
                                <input
                                    className="edit_input"
                                    value={editData.lastName || ""}
                                    onChange={e => setEditData({ ...editData, lastName: e.target.value })}
                                    placeholder="Фамилия"
                                />
                                <input
                                    className="edit_input"
                                    value={editData.middleName || ""}
                                    onChange={e => setEditData({ ...editData, middleName: e.target.value })}
                                    placeholder="Отчество"
                                />
                            </div>
                        ) : (
                            <h1 className="actor_fio">
                                {actor.lastName} {actor.firstName} {actor.middleName && actor.middleName}
                            </h1>
                    )}

                    {/** Дата рождения;  Рост;  Город;  Цвет глаз;  Натуральный цвет волос;  Образование */}
                    <div className="actor_parameters">
                        <div className="actor_param">
                            <h4>Дата рождения</h4>
                        
                            {isEdit && editData ? (
                                    <input 
                                        className="edit_input"
                                        type="date"
                                        defaultValue={formatDate(editData.dateOfBirth)}
                                        onChange={(e) => setEditData({...editData, dateOfBirth: new Date(e.target.value) })} />
                                ) : (
                                    <p>{actor.dateOfBirth.getFullYear()}.{actor.dateOfBirth.getMonth() + 1}.{actor.dateOfBirth.getDate()}</p>
                            )}
                        </div>

                        <div className="actor_param">
                            <h4>Рост</h4>
                            {isEdit && editData ? (
                                    <input
                                        className="edit_input"
                                        value={editData.height || ""}
                                        onChange={e => setEditData({ ...editData, height: Number(e.target.value) })}
                                    />
                                ) : (
                                    <p>{actor.height} см</p>
                            )}
                        </div>

                        <div className="actor_param">
                            <h4>Город</h4>
                            {isEdit && editData ? (
                                    <input
                                        className="edit_input"
                                        value={editData.city || ""}
                                        onChange={e => setEditData({ ...editData, city: e.target.value })}
                                    />
                                ) : (
                                    <p>{actor.city.name}</p>
                            )}
                        </div>
                        <div className="actor_param">
                            <h4>Цвет глаз</h4>
                            {isEdit && editData ? (
                                    <input
                                        className="edit_input"
                                        value={editData.eyeColor || ""}
                                        onChange={e => setEditData({ ...editData, eyeColor: e.target.value })}
                                    />
                                ) : (
                                    <p>{actor.eyeColor.name}</p>
                            )}
                        </div>

                        <div className="actor_param">
                            <h4>Натуральный цвет волос</h4>
                            {isEdit && editData ? (
                                    <input
                                        className="edit_input"
                                        value={editData.hairColor || ""}
                                        onChange={e => setEditData({ ...editData, hairColor: e.target.value })}
                                    />
                                ) : (
                                    <p>{actor.hairColor.name}</p>
                            )}
                        </div>

                        {isEdit && editData ? (
                                <div className="actor_param">
                                    <h4 className="actor_section_title">Образование</h4>
                                    <input
                                        className="edit_input"
                                        value={editData.education || ""}
                                        onChange={e => setEditData({ ...editData, education: e.target.value })}
                                    />
                                </div>
                            ) : (
                                actor.education && <div className="actor_param">
                                    <h4 className="actor_section_title">Образование</h4>
                                    <p>{actor.education}</p>
                                </div>
                                
                        )}

                    </div>
                    </div>

                    {/** Описание */}
                    {isEdit && editData ? (
                            <div className="actor_param">
                                <h4 className="actor_section_title">Описание</h4>
                                <textarea
                                    style={{padding: '10px'}}
                                    className="edit_input"
                                    value={editData.description || ""}
                                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                                />
                            </div>
                        ) : (
                            actor.description && (
                                <div className="floating_block">
                                <div className="actor_block">
                                    <p id="quote">❝</p>
                                    <p className="description">{actor.description}</p>
                                </div>
                                </div>
                            )
                    )}


                    <div className="floating_block">
                        {isEdit && editData ? 
                            (
                                <div id="languages" className="languages">
                                    <label htmlFor="languages">Языки* (введите язык и нажмите Enter)</label>
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
                                        {languages && languages.map(lang => (
                                            <li key={lang}>
                                                {lang}
                                                <button onClick={() => handleRemoveLanguage(lang)}>×</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            ) : (
                                actor.languages && (
                                    <div className="actor_block">
                                        <h3>Языки</h3>
                                        <ul>
                                            {actor.languages.map((l: ILanguage, idx) => (
                                                <li key={idx}><span style={{fontSize: "30px"}}>•</span> {l.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            )
                        }

                        { isEdit && editData ? 
                            (
                                <div id="languages" className="languages">
                                    <label htmlFor="">Навыки* (введите навык и нажмите Enter)</label>
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
                                </div>

                            ) : (actor.skills && (
                                <div className="actor_block">
                                    <h3>Навыки</h3>
                                    <ul>
                                        {actor.skills.map((s, i) => (
                                            <li key={i}><span style={{fontSize: "30px"}}>•</span> {s}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        }
                    </div>

                    <h3 className="actor-employee-title">Агент</h3>
                     { isEdit && editData ?
                        <>
                            <label>Агент*</label>
                            {empls && empls.map((employee) => (
                                <div key={employee.id} className="employee-choice">
                                    <input
                                        type="radio"
                                        id={`employee-${employee.id}`}
                                        name="employee"
                                        value={employee.id}
                                        checked={editData.employeeId === employee.id.toString()}
                                        onChange={e => setEditData({...editData, employeeId: employee.id})}
                                    />
                                    <p>
                                        {employee.firstName} {employee.lastName}
                                    </p>
                                </div>
                            ))}
                        </>
                        :
                        <EmployeeCard employee={actor.employee} />
                    }

                    <div className="floating_block">
                        { isEdit && editData ?
                            <div className="actor_block">
                                <h3>Видеовизитка</h3>
                                <input
                                    className="edit_input"
                                    value={editData.videoURL || ""}
                                    onChange={e => setEditData({ ...editData, videoURL: e.target.value })}
                                    placeholder="Видеовизитка"
                                />
                            </div>
                            :
                            actor.videoURL && (
                                <div className="actor_block">
                                    <h3>Видеовизитка</h3>
                                    <iframe
                                        width="720"
                                        height="405"
                                        src={actor.videoURL}
                                        style={{ border: "none" }}
                                        allow="autoplay; fullscreen"
                                    ></iframe>
                                </div>
                            )
                        }

                        <div className="actor_block">
                            <h3>Фотогалерея</h3>
                            <PhotoProvider>
                                <div className="actor_gallery">
                                    {actor.photos.map((p, i) => (
                                        <PhotoView
                                            key={i}
                                            src={actor.url + "/" + p + "_1600.jpg"}
                                        >
                                            <img
                                                src={actor.url + "/" + p + "_400.jpg"}
                                                className="actor_gallery_photo"
                                                alt="gallery"
                                            />
                                        </PhotoView>
                                    ))}
                                </div>
                            </PhotoProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
