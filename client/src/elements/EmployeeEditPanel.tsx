import { FormEvent, useEffect, useState } from "react";
import { IEmployee } from "../api/types/employeeTypes";
import fetchEmployees from "../api/fetchEmployees";
import { processError } from "../api/apiError";
import ImageCropper from "../utils/ImageCropper";
import "../styles/EmployeeEdit.css";

const fields = [
    { key: "lastName", label: "Фамилия", required: true, max: 40 },
    { key: "firstName", label: "Имя", required: true, max: 40 },
    { key: "middleName", label: "Отчество", max: 40 },
    { key: "email", label: "Email", type: "email", required: true, max: 100 },
    { key: "phone", label: "Телефон", type: "tel", required: true, max: 20 },
    { key: "telegram", label: "Telegram", max: 100 },
    { key: "vk", label: "ВКонтакте", type: "url", max: 100 },
    { key: "instagram", label: "Instagram", type: "url", max: 100 },
    { key: "facebook", label: "Facebook", type: "url", max: 100 },
] as const;
type Field = typeof fields[number]["key"] | "description";
type Draft = Record<Field, string>;

function draftFor(employee: IEmployee): Draft {
    return Object.fromEntries([...fields.map(field => field.key), "description"].map(key =>
        [key, employee[key as Field] || ""],
    )) as Draft;
}

export default function EmployeeEditPanel({ employee, token, onSave, onCancel }: {
    employee: IEmployee; token: string; onSave: (employee: IEmployee) => void; onCancel: () => void;
}) {
    const [draft, setDraft] = useState(() => draftFor(employee));
    const [avatar, setAvatar] = useState<File>();
    const [cropFile, setCropFile] = useState<File>();
    const [preview, setPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const changed = Boolean(avatar) || JSON.stringify(draft) !== JSON.stringify(draftFor(employee));
    useEffect(() => {
        if (!avatar) return;
        const url = URL.createObjectURL(avatar);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [avatar]);
    useEffect(() => {
        if (!changed) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [changed]);
    const save = async (event: FormEvent) => {
        event.preventDefault();
        if (saving) return;
        setError("");
        setSaving(true);
        try {
            const data = new FormData();
            data.append("id", employee.id);
            for (const key of Object.keys(draft) as Field[]) {
                if (draft[key] !== (employee[key] || "")) data.append(key, draft[key]);
            }
            if (avatar) data.append("newAvatar", avatar);
            onSave(await fetchEmployees.edit(token, data));
        } catch (e) {
            setError(processError(e));
        } finally {
            setSaving(false);
        }
    };
    return <form className="employee-edit" onSubmit={save} aria-label="Редактирование агента">
        <h2>Редактирование агента</h2>
        <fieldset disabled={saving}>
            <div className="employee-edit-fields">
                {fields.map(field => <label key={field.key} htmlFor={`agent-${field.key}`}>
                    {field.label}{"required" in field && field.required ? " *" : ""}
                    <input id={`agent-${field.key}`} type={"type" in field ? field.type : "text"}
                        required={"required" in field && field.required} maxLength={field.max}
                        value={draft[field.key]} onChange={e => setDraft({ ...draft, [field.key]: e.target.value })} />
                </label>)}
                <div className="employee-edit-wide">
                    <label htmlFor="agent-description">Описание</label>
                    <textarea id="agent-description" rows={5} value={draft.description}
                        onChange={e => setDraft({ ...draft, description: e.target.value })} />
                </div>
                <label className="employee-edit-wide" htmlFor="agent-avatar">Фото агента
                    <input id="agent-avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => {
                        const file = e.target.files?.[0]; e.target.value = "";
                        if (!file) return;
                        if (file.size > 20 * 1024 ** 2 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                            setError("Выберите JPG, PNG или WebP размером до 20 МБ."); return;
                        }
                        setError(""); setCropFile(file);
                    }} />
                </label>
            </div>
            {preview && <img className="employee-edit-preview" src={preview} alt="Новое фото агента" />}
            {error && <p className="employee-edit-error" role="alert">{error}</p>}
            <div className="employee-edit-actions">
                <button className="btn" type="submit" disabled={!changed || Boolean(cropFile)}>{saving ? "Сохранение…" : "Сохранить"}</button>
                <button className="btn" type="button" onClick={() => {
                    if (!changed || window.confirm("Отменить изменения агента?")) onCancel();
                }}>Отмена</button>
            </div>
        </fieldset>
        {cropFile && <ImageCropper imageFile={cropFile} aspect={4 / 5}
            onCropped={file => { setAvatar(file); setCropFile(undefined); }} onCancel={() => setCropFile(undefined)} />}
    </form>;
}
