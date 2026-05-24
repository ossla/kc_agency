import type { Dispatch, SetStateAction } from "react"
import { EditActorType } from "../api/types/actorTypes"
import { IEmployee } from "../api/types/employeeTypes"
import { ILanguage } from "../api/types/relevantTypes"
import Loading from "./Loading"
import TagEditor from "./TagEditor"
import "../styles/Admin.css"

interface ActorEditPanelProps {
    editData: EditActorType
    setEditData: Dispatch<SetStateAction<EditActorType | null>>
    employees?: IEmployee[] | null
    loadedLanguages: ILanguage[]
    languages: string[]
    setLanguages: Dispatch<SetStateAction<string[]>>
    skills: string[]
    setSkills: Dispatch<SetStateAction<string[]>>
    isSaving: boolean
    onSave: () => void
    onCancel: () => void
    formatDate: (date: Date) => string
}

export default function ActorEditPanel({
    editData,
    setEditData,
    employees,
    loadedLanguages,
    languages,
    setLanguages,
    skills,
    setSkills,
    isSaving,
    onSave,
    onCancel,
    formatDate
}: ActorEditPanelProps) {
    const updateEditData = (patch: Partial<EditActorType>) => {
        setEditData(prev => prev ? { ...prev, ...patch } : prev)
    }

    return (
        <>
            <div style={{ marginTop: "10px" }}>
                <button className="btn" onClick={onSave} disabled={isSaving}>
                    {isSaving ? "Сохраняем..." : "Сохранить"}
                </button>
                <button
                    className="btn"
                    onClick={onCancel}
                    disabled={isSaving}
                    style={{ marginLeft: "10px" }}
                >
                    Отмена
                </button>
                {isSaving && <Loading />}
            </div>

            <div className="person_param">
                <h4>Пол</h4>
                <input
                    id="M"
                    type="radio"
                    checked={editData.gender === "M"}
                    value="M"
                    onChange={event => updateEditData({ gender: event.target.value })}
                />
                <label htmlFor="M">Мужчина</label>
                <input
                    id="W"
                    type="radio"
                    checked={editData.gender === "W"}
                    value="W"
                    onChange={event => updateEditData({ gender: event.target.value })}
                />
                <label htmlFor="W">Женщина</label>
            </div>

            <div className="floating_block">
                <div>
                    <input
                        className="edit_input"
                        value={editData.lastName || ""}
                        onChange={event => updateEditData({ lastName: event.target.value })}
                        placeholder="Last name"
                    />
                    <input
                        className="edit_input"
                        value={editData.firstName || ""}
                        onChange={event => updateEditData({ firstName: event.target.value })}
                        placeholder="First name"
                    />
                    <input
                        className="edit_input"
                        value={editData.middleName || ""}
                        onChange={event => updateEditData({ middleName: event.target.value })}
                        placeholder="Middle name"
                    />
                </div>

                <div className="person_parameters">
                    <div className="person_param">
                        <h4>Дата рождения</h4>
                        <input
                            className="edit_input"
                            type="date"
                            value={formatDate(editData.dateOfBirth)}
                            onChange={event => updateEditData({ dateOfBirth: new Date(event.target.value) })}
                        />
                    </div>

                    <div className="person_param">
                        <h4>Рост</h4>
                        <input
                            className="edit_input"
                            value={editData.height || ""}
                            onChange={event => updateEditData({ height: Number(event.target.value) })}
                        />
                    </div>

                    <div className="person_param">
                        <h4>Город</h4>
                        <input
                            className="edit_input"
                            value={editData.city || ""}
                            onChange={event => updateEditData({ city: event.target.value })}
                        />
                    </div>

                    <div className="person_param">
                        <h4>Цвет глаз</h4>
                        <input
                            className="edit_input"
                            value={editData.eyeColor || ""}
                            onChange={event => updateEditData({ eyeColor: event.target.value })}
                        />
                    </div>

                    <div className="person_param">
                        <h4>Цвет волос</h4>
                        <input
                            className="edit_input"
                            value={editData.hairColor || ""}
                            onChange={event => updateEditData({ hairColor: event.target.value })}
                        />
                    </div>

                    <div className="person_param">
                        <h4 className="person_section_title">Образование</h4>
                        <input
                            className="edit_input"
                            value={editData.education || ""}
                            onChange={event => updateEditData({ education: event.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="person_param">
                <h4 className="person_section_title">Описание</h4>
                <textarea
                    style={{ padding: "10px" }}
                    className="edit_input"
                    value={editData.description || ""}
                    onChange={event => updateEditData({ description: event.target.value })}
                />
            </div>

            <div className="floating_block">
                <TagEditor
                    label="Языки"
                    values={languages}
                    onChange={setLanguages}
                    suggestions={loadedLanguages.map(lang => lang.name)}
                    placeholder="Добавить язык"
                />

                <TagEditor
                    label="Навыки"
                    values={skills}
                    onChange={setSkills}
                    placeholder="Боевые искусства, игра на скрипке, жанглирование..."
                />
            </div>

            <div className="floating_block">
                <div className="person_parameters">
                    <label>FilmToolz URL</label>
                    <input
                        className="edit_input"
                        value={editData.linkToFilmTools || ""}
                        onChange={event => updateEditData({ linkToFilmTools: event.target.value })}
                    />

                    <label>Kinopoisk URL</label>
                    <input
                        className="edit_input"
                        value={editData.linkToKinopoisk || ""}
                        onChange={event => updateEditData({ linkToKinopoisk: event.target.value })}
                    />

                    <label>KinoTeatr URL</label>
                    <input
                        className="edit_input"
                        value={editData.linkToKinoTeatr || ""}
                        onChange={event => updateEditData({ linkToKinoTeatr: event.target.value })}
                    />
                </div>
            </div>

            <h3 className="person-employee-title">Агент</h3>
            <label>Агент*</label>
            {employees && employees.map(employee => (
                <div key={employee.id} className="employee-choice">
                    <input
                        type="radio"
                        id={`employee-${employee.id}`}
                        name="employee"
                        value={employee.id}
                        checked={editData.employeeId === employee.id}
                        onChange={event => updateEditData({ employeeId: event.target.value })}
                    />
                    <p>
                        {employee.firstName} {employee.lastName}
                    </p>
                </div>
            ))}

            <div className="floating_block">
                <div className="person_block">
                    <h3>Видео-визитка</h3>
                    <input
                        className="edit_input"
                        value={editData.videoURL || ""}
                        onChange={event => updateEditData({ videoURL: event.target.value })}
                        placeholder="URL"
                    />
                </div>
            </div>
        </>
    )
}
