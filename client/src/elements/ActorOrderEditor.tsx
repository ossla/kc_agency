import { useEffect, useState } from "react"
import fetchActors from "../api/fetchActors"
import { IShortActor } from "../api/types/actorTypes"
import { GenderEnum } from "../api/types/enums"
import { processError } from "../api/apiError"
import { ResponseHandler } from "../api/ResponseHandler"
import "../styles/ActorOrderEditor.css"

export default function ActorOrderEditor({ gender, token, onClose }: {
    gender: GenderEnum; token: string; onClose: () => void
}) {
    const [actors, setActors] = useState<IShortActor[]>([])
    const [original, setOriginal] = useState<string[]>([])
    const [busy, setBusy] = useState(true)
    const [ready, setReady] = useState(false)
    const [error, setError] = useState('')
    useEffect(() => {
        let cancelled = false
        fetchActors.getShortByGender(gender).then(data => {
            if (!cancelled) { setActors(data); setOriginal(data.map(actor => actor.id)); setReady(true) }
        }).catch(e => { if (!cancelled) setError(processError(e)) })
            .finally(() => { if (!cancelled) setBusy(false) })
        return () => { cancelled = true }
    }, [gender])
    const move = (from: number, to: number) => {
        setActors(current => {
            const next = [...current]
            const [actor] = next.splice(from, 1)
            next.splice(to, 0, actor)
            return next
        })
    }
    const save = async () => {
        setBusy(true); setError('')
        try {
            const response = await fetch('/api/actor/order', {
                method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ gender, ids: actors.map(actor => actor.id), originalIds: original }),
            })
            await ResponseHandler(response, value => value)
            onClose()
        } catch (e) { setError(processError(e)) }
        finally { setBusy(false) }
    }
    return <section className="actor-order container" aria-label="Порядок актёров" aria-busy={busy}>
        <h1>Порядок актёров</h1>
        <div className="actor-order-actions">
            <button className="btn" disabled={busy || !ready} onClick={save}>Сохранить порядок</button>
            <button className="btn" disabled={busy} onClick={onClose}>Отмена</button>
        </div>
        {busy && <p role="status">Загрузка…</p>}
        {error && <p role="alert">{error}</p>}
        <ol>
            {actors.map((actor, index) => <li key={actor.id}>
                <img src={`${actor.avatarUrl}_400.jpg`} alt="" width={48} height={64} loading="lazy" />
                <span>{actor.lastName} {actor.firstName}</span>
                <select aria-label={`Позиция: ${actor.lastName} ${actor.firstName}`} value={index} disabled={busy}
                    onChange={event => move(index, Number(event.target.value))}>
                    {actors.map((_, position) => <option key={position} value={position}>{position + 1}</option>)}
                </select>
                <button title="Выше" aria-label={`Выше: ${actor.lastName}`} disabled={busy || index === 0} onClick={() => move(index, index - 1)}>↑</button>
                <button title="Ниже" aria-label={`Ниже: ${actor.lastName}`} disabled={busy || index === actors.length - 1} onClick={() => move(index, index + 1)}>↓</button>
            </li>)}
        </ol>
    </section>
}
