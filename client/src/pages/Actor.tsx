import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Link } from 'react-router-dom';
import "../styles/Person.css";
import { EditActorType, IActor } from "../api/types/actorTypes";
import { useNavigate, useParams } from "react-router-dom";
import fetchActors from "../api/fetchActors";
import Loading from "../elements/Loading";
import { ILanguage } from "../api/types/relevantTypes";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { processError } from "../api/apiError";
import { EmployeeCard } from "../elements/EmployeeCard";
import { useUser } from "../context/UserContext";
import { HOME, EMPLOYEES } from "../routes";
import { IEmployee } from "../api/types/employeeTypes";
import fetchEmployees from "../api/fetchEmployees";
import fetchRelevant from "../api/fetchRelevant";
import ActorPhotoEditor from "../elements/ActorPhotoEditor";
import ActorEditPanel from "../elements/ActorEditPanel";

const getAge = (value: Date | string | undefined) => {
    if (!value) return null;

    const birthDate = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }

    return age;
};

const formatAgeString = (age: number) => {
    const rem100 = age % 100;
    if (rem100 >= 11 && rem100 <= 14) return `${age} лет`;

    const rem10 = age % 10;
    if (rem10 === 1) return `${age} год`;
    if (rem10 >= 2 && rem10 <= 4) return `${age} года`;

    return `${age} лет`;
};

const getEditSnapshot = (editData: EditActorType, languages: string[], skills: string[]) => {
    return JSON.stringify({
        firstName: editData.firstName || "",
        lastName: editData.lastName || "",
        middleName: editData.middleName || "",
        dateOfBirth: editData.dateOfBirth ? new Date(editData.dateOfBirth).toISOString() : "",
        employeeId: editData.employeeId || "",
        height: editData.height ?? "",
        gender: editData.gender || "",
        city: editData.city || "",
        eyeColor: editData.eyeColor || "",
        hairColor: editData.hairColor || "",
        description: editData.description || "",
        videoURL: editData.videoURL || "",
        education: editData.education || "",
        linkToFilmTools: editData.linkToFilmTools || "",
        linkToKinopoisk: editData.linkToKinopoisk || "",
        linkToKinoTeatr: editData.linkToKinoTeatr || "",
        languages,
        skills
    });
};

const getActorEditSnapshot = (actor: IActor) => {
    return getEditSnapshot({
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
        linkToFilmTools: actor.linkToFilmTools,
        linkToKinopoisk: actor.linkToKinopoisk,
        linkToKinoTeatr: actor.linkToKinoTeatr,
        skills: [],
        languages: []
    }, actor.languages?.map(language => language.name) ?? [], actor.skills ?? []);
};

const linkify = (text: string | null | undefined): React.ReactNode => {
    if (!text) return null;

    const urlRegex = /(?:(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/\S*)?)/g;
    const emailRegex = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
    const combined = new RegExp(emailRegex.source + '|' + urlRegex.source, 'g');

    const parts: Array<string | React.ReactNode> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = combined.exec(text)) !== null) {
        const idx = match.index;
        if (idx > lastIndex) parts.push(text.slice(lastIndex, idx));

        const matched = match[0];
        if (/@/.test(matched)) {
            parts.push(
                <a key={idx} href={`mailto:${matched}`}>{matched}</a>
            );
        } else {
            const href = /^https?:\/\//.test(matched) ? matched : `http://${matched}`;
            parts.push(
                <a key={idx} href={href} target="_blank" rel="noopener noreferrer">{matched}</a>
            );
        }

        lastIndex = idx + matched.length;
    }

    if (lastIndex < text.length) parts.push(text.slice(lastIndex));

    return parts;
};

export default function ActorPage() {
    const { id } = useParams();
    const [actor, setActor] = useState<IActor>();
    const [error, setError] = useState<string | null>(null);

    const { user, accessToken } = useUser();
    const [isEdit, setIsEdit] = useState(false);
    const [isPhotoEdit, setIsPhotoEdit] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<EditActorType | null>(null);
    const navigator = useNavigate();
    const [empls, setEmpls] = useState<IEmployee[] | null>();
    const [loadedLanguages, setLoadedLanguages] = useState<ILanguage[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [skills, setSkills] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!id) throw new Error("Актёр не найден");
                setActor(await fetchActors.getActor(id));
            } catch(e: unknown) {
                setError(processError(e));
            }
        };
        loadData();
    }, [id]);

    const isDirty = useMemo(() => {
        if (!actor || !editData) return false;
        return getEditSnapshot(editData, languages, skills) !== getActorEditSnapshot(actor);
    }, [actor, editData, languages, skills]);

    useEffect(() => {
        if (!isDirty) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            (event as { returnValue: string }).returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

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
            linkToFilmTools: actor.linkToFilmTools,
            linkToKinopoisk: actor.linkToKinopoisk,
            linkToKinoTeatr: actor.linkToKinoTeatr,
            skills: [],
            languages: []
        });

        setLanguages(actor.languages?.map(language => language.name) ?? []);
        setSkills(actor.skills ?? []);
        setEmpls(await fetchEmployees.get());
        setLoadedLanguages(await fetchRelevant.getLanguages());

        setIsEdit(true);
    };

    const handleSave = async () => {
        if (!editData || !accessToken || isSaving) return;
        if (!actor) {
            setError("Actor not found");
            return;
        }

        {
            const required_fields = [
                { value: editData.firstName, label: "First name" },
                { value: editData.lastName, label: "Last name" },
                { value: editData.dateOfBirth, label: "Date of birth" },
                { value: editData.gender, label: "Gender" },
                { value: editData.height, label: "Height" },
                { value: editData.employeeId, label: "Employee ID" },
                { value: editData.eyeColor, label: "Eye color" },
                { value: editData.hairColor, label: "Hair color" },
                { value: editData.city, label: "City" },
            ];
        
            const emptyField = required_fields.find(field => !field.value);
    
            if (emptyField) {
                setError(`Field "${emptyField.label}" is required`);
                return;
            }
        }

        setIsSaving(true);
        try {
            const formData = new FormData();

            formData.append("id", actor.id);

            if (editData.firstName !== actor.firstName) formData.append("firstName", editData.firstName!);
            if (editData.lastName !== actor.lastName) formData.append("lastName", editData.lastName!);
            if (editData.middleName !== actor.middleName) formData.append("middleName", editData.middleName!);
            if (editData.height !== actor.height) formData.append("height", String(editData.height));
            if (editData.description !== actor.description) formData.append("description", editData.description!);
            if (editData.videoURL !== actor.videoURL) formData.append("videoURL", editData.videoURL!);
            if (editData.city !== actor.city?.name) formData.append("city", editData.city!);
            if (editData.eyeColor !== actor.eyeColor?.name) formData.append("eyeColor", editData.eyeColor!);
            if (editData.linkToFilmTools !== actor.linkToFilmTools) formData.append("linkToFilmTools", editData.linkToFilmTools!);
            if (editData.linkToKinopoisk !== actor.linkToKinopoisk) formData.append("linkToKinopoisk", editData.linkToKinopoisk!);
            if (editData.linkToKinoTeatr !== actor.linkToKinoTeatr) formData.append("linkToKinoTeatr", editData.linkToKinoTeatr!);
            if (
                editData.dateOfBirth &&
                actor.dateOfBirth &&
                new Date(editData.dateOfBirth).toISOString() !==
                    new Date(actor.dateOfBirth).toISOString()
            ) {
                formData.append(
                    "dateOfBirth",
                    new Date(editData.dateOfBirth).toISOString()
                );
            }
            if (JSON.stringify(languages) !== JSON.stringify(actor.languages?.map(language => language.name))) {
                formData.append("languages", JSON.stringify(languages));
            }
            if (JSON.stringify(skills) !== JSON.stringify(actor.skills)) {
                formData.append("skills", JSON.stringify(skills));
            }

            const updated = await fetchActors.editActor(accessToken, formData);

            setActor(updated);
            setError(null);
            setIsEdit(false);
            setEditData(null);
        } catch (e) {
            setError(processError(e));
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0];
    };

    const handleCancelEdit = () => {
        if (isDirty && !window.confirm("отменить изменения?")) return;

        setIsEdit(false);
        setEditData(null);
    };

    const handleDelete = async () => {
        if (!actor || !accessToken) return;

        if (!window.confirm("Delete actor?")) return;

        await fetchActors.deleteActor(accessToken, actor.id);

        navigator(HOME);
    };

    if (!actor) return <Loading />;

    return (
        <div className="person_page_wrapper">
            <div className="person_grid">
                <div className="person_left">
                    <PhotoProvider>
                        <PhotoView src={actor.url + "/avatar_1600.jpg"}>
                            <img
                                className="person_avatar"
                                src={actor.url + "/avatar_400.jpg"}
                                alt="avatar"
                            />
                        </PhotoView>
                    </PhotoProvider>

                    {!isEdit && (
                        <>
                            <div className="person_actions">
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

                            {actor.employee && (
                                <div className="person_agent_compact floating_block">
                                    <h3 className="person_agent_title">
                                        <Link to={EMPLOYEES + '/' + actor.employee.id} className="agent_heading_link">Агент</Link>
                                    </h3>

                                    <div className="agent_compact">
                                        {actor.employee.avatarUrl && (
                                            <Link to={EMPLOYEES + '/' + actor.employee.id} className="agent_photo_link">
                                                <img
                                                    className="agent_photo"
                                                    src={actor.employee.avatarUrl + "_400.jpg"}
                                                    alt="agent"
                                                />
                                            </Link>
                                        )}

                                        <div className="agent_contacts">
                                            <Link to={EMPLOYEES + '/' + actor.employee.id} className="agent_name_link">
                                                <h4 className="agent_name">{actor.employee.lastName} {actor.employee.firstName}{actor.employee.middleName ? ` ${actor.employee.middleName}` : ''}</h4>
                                            </Link>

                                            {actor.employee.phone && <h4 className="agent_contact_text">{actor.employee.phone}</h4>}
                                            {actor.employee.email && <h4 className="agent_contact_text">{actor.employee.email}</h4>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="person_right">
                    {error && <h1 style={{ padding: "5px", backgroundColor: "#fda8a8" }}>{error}</h1>}

                    {isEdit && editData ? (
                        <ActorEditPanel
                            editData={editData}
                            setEditData={setEditData}
                            employees={empls}
                            loadedLanguages={loadedLanguages}
                            languages={languages}
                            setLanguages={setLanguages}
                            skills={skills}
                            setSkills={setSkills}
                            isSaving={isSaving}
                            onSave={handleSave}
                            onCancel={handleCancelEdit}
                            formatDate={formatDate}
                        />
                    ) : (
                        <>
                            {user?.isAdmin && (
                                <div className="floating_block">
                                    <div style={{ marginBottom: "10px" }}>
                                        <button className="btn" onClick={startEdit}>Редактировать</button>
                                        <button className="btn" onClick={handleDelete} style={{ marginLeft: "10px" }}>
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="floating_block">
                                <h1 className="person_fio">
                                    {actor.lastName} {actor.firstName} {actor.middleName && actor.middleName}
                                </h1>

                                <div className="person_parameters">
                                    <div className="person_param">
                                        <h4>Возраст</h4>
                                        <p>
                                            {(() => {
                                                const age = getAge(actor.dateOfBirth);
                                                return age === null ? "Не указан" : formatAgeString(age);
                                            })()}
                                        </p>
                                    </div>

                                    <div className="person_param">
                                        <h4>Рост</h4>
                                        <p>{actor.height} см</p>
                                    </div>

                                    <div className="person_param">
                                        <h4>Город</h4>
                                        <p>{actor.city.name}</p>
                                    </div>
                                    <div className="person_param">
                                        <h4>Цвет глаз</h4>
                                        <p>{actor.eyeColor.name}</p>
                                    </div>

                                    <div className="person_param">
                                        <h4>Натуральный цвет волос</h4>
                                        <p>{actor.hairColor.name}</p>
                                    </div>

                                    {actor.education && (
                                        <div className="person_param">
                                            <h4 className="person_section_title">Образование</h4>
                                            <p>{actor.education}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {actor.description && (
                                <div className="floating_block">
                                    <div className="person_block">
                                        <p id="quote">❝</p>
                                        <p className="description">{linkify(actor.description)}</p>
                                    </div>
                                </div>
                            )}

                            {((actor.languages && actor.languages.length > 0) || (actor.skills && actor.skills.length > 0)) && (
                                <div className="floating_block">
                                    {actor.languages && actor.languages.length > 0 && (
                                        <div className="person_block">
                                            <h3>Языки</h3>
                                            <ul>
                                                {actor.languages.map((language: ILanguage, idx) => (
                                                    <li key={idx}><span style={{ fontSize: "30px" }}>•</span> {language.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {actor.skills && actor.skills.length > 0 && (
                                        <div className="person_block">
                                            <h3>Навыки</h3>
                                            <ul>
                                                {actor.skills.map((skill, idx) => (
                                                    <li key={idx}><span style={{ fontSize: "30px" }}>•</span> {skill}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {actor.videoURL && (
                                <div className="floating_block">
                                    <div className="person_block">
                                        <h3>Видеовизитка</h3>
                                        <iframe
                                            width="720"
                                            height="405"
                                            src={actor.videoURL}
                                            style={{ border: "none" }}
                                            allow="autoplay; fullscreen"
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            <div className="floating_block">
                                <div className="person_block">
                                    {user?.isAdmin && (
                                        <button
                                            style={{ marginTop: "20px" }}
                                            className="btn"
                                            onClick={() => setIsPhotoEdit(current => !current)}
                                        >
                                            Редактировать фото
                                        </button>
                                    )}

                                    {(isPhotoEdit && actor && accessToken) ? (
                                        <ActorPhotoEditor
                                            actorId={actor.id}
                                            initialPhotos={actor.photos}
                                            baseUrl={actor.url}
                                            accessToken={accessToken}
                                            onChange={photos => {
                                                setActor(prev => prev ? { ...prev, photos } : prev);
                                            }}
                                        /> 
                                    ) : (
                                        <>
                                            <h3>Фотогалерея</h3>
                                            <PhotoProvider>
                                                <div className="person_gallery">
                                                    {actor.photos.map((photo, idx) => (
                                                        <PhotoView
                                                            key={idx}
                                                            src={actor.url + "/" + photo + "_1600.jpg"}
                                                        >
                                                            <img
                                                                src={actor.url + "/" + photo + "_400.jpg"}
                                                                className="person_gallery_photo"
                                                                alt="gallery"
                                                            />
                                                        </PhotoView>
                                                    ))}
                                                </div>
                                            </PhotoProvider>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
