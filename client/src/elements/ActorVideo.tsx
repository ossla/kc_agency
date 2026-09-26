import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "../styles/ActorVideo.css";

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

export function ActorVideoEditor({ actorId, src, token, onChange }: {
    actorId: string; src?: string; token: string; onChange: (url: string) => void;
}) {
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [maxBytes, setMaxBytes] = useState<number>();
    const request = useRef<XMLHttpRequest | null>(null);
    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        fetch("/api/actor-video/config", { headers: { Authorization: `Bearer ${token}` } })
            .then(async r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => setMaxBytes(data.maxBytes)).catch(() => setError("Не удалось получить лимит загрузки. Обновите страницу."));
        return () => request.current?.abort();
    }, [token]);
    const send = (file?: File) => {
        setError("");
        if (file && (!maxBytes || file.size > maxBytes)) {
            setError(`Размер файла превышает лимит ${Math.round((maxBytes || 0) / 1024 ** 2)} МБ.`);
            return;
        }
        setProgress(0);
        const xhr = new XMLHttpRequest();
        request.current = xhr;
        xhr.open(file ? "POST" : "DELETE", `/api/actor-video/${actorId}`);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.upload.onprogress = e => { if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100)); };
        xhr.onload = () => {
            setProgress(null);
            if (xhr.status >= 200 && xhr.status < 300) {
                onChange(JSON.parse(xhr.responseText).videoURL);
            } else {
                setError(xhr.status === 413 ? "Видео превышает лимит сервера." :
                    xhr.status === 401 || xhr.status === 403 ? "Авторизуйтесь как администратор." :
                    "Не удалось сохранить видео. Нужен MP4 с видео H.264 и звуком AAC.");
            }
        };
        xhr.onerror = () => { setProgress(null); setError("Ошибка соединения. Проверьте страницу перед повторной загрузкой."); };
        xhr.onabort = () => setProgress(null);
        if (file) { const data = new FormData(); data.append("video", file); xhr.send(data); }
        else xhr.send();
    };
    return <div className="actor-video-editor">
        <input ref={input} type="file" accept="video/mp4,.mp4" hidden onChange={e => {
            const file = e.target.files?.[0]; e.target.value = ""; if (file) send(file);
        }} />
        <button className="btn" disabled={progress !== null || !maxBytes} onClick={() => input.current?.click()}>
            {src ? "Заменить видео" : "Загрузить видео"}
        </button>
        {src && <button className="btn" disabled={progress !== null} onClick={() => {
            if (window.confirm("Удалить видеовизитку?")) send();
        }}>Удалить видео</button>}
        {progress !== null && <div role="status"><progress max="100" value={progress} /> {progress === 100 ? "Проверка и сохранение…" : `${progress}%`}</div>}
        {error && <p role="alert">{error}</p>}
    </div>;
}
