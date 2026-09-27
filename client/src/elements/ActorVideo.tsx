import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "../styles/ActorVideo.css";
import { IActorVideo } from "../api/types/actorTypes";

export function ActorVideo({ src }: { src: string }) {
    const host = useRef<HTMLDivElement>(null);
    const [failed, setFailed] = useState(false);
    const local = src.startsWith("/uploads/");
    useEffect(() => {
        setFailed(false);
        if (!local || !host.current) return;
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.preload = "metadata";
        video.playsInline = true;
        const onError = () => setFailed(true);
        video.addEventListener("error", onError);
        host.current.appendChild(video);
        const player = new Plyr(video, {
            iconUrl: "/plyr.svg", blankVideo: "", ratio: "16:9", hideControls: false,
            controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "settings", "fullscreen"],
            settings: ["speed"],
        });
        const container = host.current;
        return () => {
            video.removeEventListener("error", onError);
            player.destroy();
            container.replaceChildren();
        };
    }, [src, local]);
    return <div className="actor-video">
        {local ? <div ref={host} /> : <iframe src={src} title="Видеовизитка" allow="autoplay; fullscreen" allowFullScreen />}
        {failed && <p role="alert">Не удалось воспроизвести видео.</p>}
    </div>;
}

export function ActorVideos({ videos, actorId, token, onChange }: {
    videos: IActorVideo[]; actorId?: string; token?: string; onChange?: (videos: IActorVideo[]) => void;
}) {
    const [selectedId, setSelectedId] = useState("");
    const [busy, setBusy] = useState(false);
    const selected = videos.find(video => video.id === selectedId) || videos[0];
    return <div className="actor-videos">
        {videos.length > 0 && <div className="actor-video-selection">
            <select aria-label="Выбрать видео" value={selected.id} disabled={busy}
                onChange={e => setSelectedId(e.target.value)}>
                {videos.map((video, index) => <option key={video.id} value={video.id}>
                    {index + 1}. {video.name || `Видео ${index + 1}`}
                </option>)}
            </select>
            <span>{videos.findIndex(video => video.id === selected.id) + 1} / {videos.length}</span>
        </div>}
        {selected && <ActorVideo key={selected.id} src={selected.url} />}
        {actorId && token && onChange && <ActorVideoEditor actorId={actorId} selected={selected} token={token}
            onBusy={setBusy} onChange={(next, uploadedId) => {
                onChange(next);
                if (uploadedId) setSelectedId(uploadedId);
            }} />}
    </div>;
}

export function ActorVideoEditor({ actorId, selected, token, onChange, onBusy }: {
    actorId: string; selected?: IActorVideo; token: string;
    onChange: (videos: IActorVideo[], uploadedId?: string) => void; onBusy: (busy: boolean) => void;
}) {
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [maxBytes, setMaxBytes] = useState<number>();
    const request = useRef<XMLHttpRequest | null>(null);
    const input = useRef<HTMLInputElement>(null);
    const replacementId = useRef<string | undefined>(undefined);
    useEffect(() => {
        fetch("/api/actor-video/config", { headers: { Authorization: `Bearer ${token}` } })
            .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => setMaxBytes(data.maxBytes)).catch(() => setError("Не удалось получить лимит загрузки. Обновите страницу."));
        return () => request.current?.abort();
    }, [token]);
    const send = (file?: File, videoId?: string) => {
        setError("");
        if (file && (!maxBytes || file.size > maxBytes)) {
            setError(`Размер файла превышает лимит ${Math.round((maxBytes || 0) / 1024 ** 2)} МБ.`);
            return;
        }
        setProgress(0);
        onBusy(true);
        const xhr = new XMLHttpRequest();
        request.current = xhr;
        xhr.open(file ? "POST" : "DELETE", `/api/actor-video/${actorId}${videoId ? `/${encodeURIComponent(videoId)}` : ""}`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.upload.onprogress = e => { if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => {
            setProgress(null);
            onBusy(false);
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (!Array.isArray(data.videos) || !data.videos.every((video: IActorVideo) =>
                        typeof video.id === "string" && typeof video.url === "string" && typeof video.name === "string")) throw new Error("Invalid response");
                    onChange(data.videos, data.uploadedId);
                } catch {
                    setError(`HTTP ${xhr.status}: сервер вернул неожиданный ответ. Обновите страницу перед повторной загрузкой.`);
                }
            } else {
                let message = "Не удалось сохранить изменения видео.";
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (typeof data?.message === "string") message = data.message;
                } catch { /* A proxy can return an HTML error page instead of JSON. */ }
                if (xhr.status === 413) message = "Видео превышает лимит сервера или прокси.";
                if (xhr.status === 401 || xhr.status === 403) message = "Авторизуйтесь как администратор.";
                if (xhr.status === 502) message = "Прокси не получил корректный ответ от сервера приложения.";
                if (xhr.status === 504) message = "Прокси не дождался ответа сервера. Обновите страницу перед повторной загрузкой.";
                setError(`HTTP ${xhr.status}: ${message}`);
            }
        };
        xhr.onerror = () => { setProgress(null); onBusy(false); setError("Ошибка соединения. Проверьте страницу перед повторной загрузкой."); };
        xhr.onabort = () => { setProgress(null); onBusy(false); };
        if (file) { const data = new FormData(); data.append("video", file); xhr.send(data); }
        else xhr.send();
    };
    return <div className="actor-video-editor">
        <input ref={input} type="file" accept="video/mp4,.mp4" hidden onChange={e => {
            const file = e.target.files?.[0]; e.target.value = ""; if (file) send(file, replacementId.current);
        }} />
        <button className="btn" disabled={progress !== null || !maxBytes} onClick={() => {
            replacementId.current = undefined; input.current?.click();
        }}>
            Добавить видео
        </button>
        {selected && <>
            <button className="btn" disabled={progress !== null || !maxBytes} onClick={() => {
                replacementId.current = selected.id; input.current?.click();
            }}>Заменить выбранное</button>
            <button className="btn" disabled={progress !== null} onClick={() => {
                if (window.confirm(`Удалить видео «${selected.name}»?`)) send(undefined, selected.id);
            }}>Удалить выбранное</button>
        </>}
        {progress !== null && <div role="status"><progress max="100" value={progress} /> {progress === 100 ? "Проверка и сохранение…" : `${progress}%`}</div>}
        {error && <p role="alert">{error}</p>}
    </div>;
}
