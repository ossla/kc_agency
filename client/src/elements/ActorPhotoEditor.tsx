import { useRef, useState } from "react";
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import fetchActors from "../api/fetchActors";
import { processError } from "../api/apiError";
import "../styles/ActorPhotoEditor.css";

type Props = {
    actorId: string; initialPhotos: string[]; baseUrl: string; accessToken: string;
    onChange: (photos: string[]) => void; onBusy?: (busy: boolean) => void;
};

function Photo({ id, index, total, baseUrl, busy, onDelete, onMove }: {
    id: string; index: number; total: number; baseUrl: string; busy: boolean;
    onDelete: () => void; onMove: (direction: number) => void;
}) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: busy });
    return <li ref={setNodeRef} className="actor-photo-item" data-photo-id={id}
        style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 2 : undefined }}>
        <img src={`${baseUrl}/${id}_400.jpg`} alt={`Фото ${index + 1}`} draggable={false} />
        <button type="button" className="actor-photo-delete" disabled={busy} onClick={onDelete}
            aria-label={`Удалить фото ${index + 1}`} title="Удалить фото">×</button>
        <div className="actor-photo-controls">
            <button type="button" disabled={busy || index === 0} onClick={() => onMove(-1)}
                aria-label={`Переместить фото ${index + 1} раньше`} title="Переместить раньше">←</button>
            <button ref={setActivatorNodeRef} type="button" className="actor-photo-drag" disabled={busy} {...attributes} {...listeners}
                aria-label={`Перетащить фото ${index + 1}`} title="Перетащить фото">⠿</button>
            <button type="button" disabled={busy || index === total - 1} onClick={() => onMove(1)}
                aria-label={`Переместить фото ${index + 1} позже`} title="Переместить позже">→</button>
        </div>
        <span className="actor-photo-number">{index + 1}</span>
    </li>;
}

export default function ActorPhotoEditor({ actorId, initialPhotos: photos, baseUrl, accessToken, onChange, onBusy }: Props) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const locked = useRef(false);
    const input = useRef<HTMLInputElement>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );
    const perform = async (action: () => Promise<string[]>) => {
        if (locked.current) return;
        locked.current = true; setBusy(true); onBusy?.(true); setError(""); setStatus("");
        try { onChange(await action()); setStatus("Сохранено"); }
        catch (e) { setError(processError(e)); }
        finally { locked.current = false; setBusy(false); onBusy?.(false); }
    };
    const move = (from: number, to: number) => {
        if (from < 0 || to < 0 || to >= photos.length || from === to) return;
        const next = arrayMove(photos, from, to);
        void perform(async () => { await fetchActors.changeOrder(accessToken, actorId, next); return next; });
    };
    return <section className="actor-photo-editor" aria-label="Редактирование фотогалереи" aria-busy={busy}>
        <h3>Фотогалерея ({photos.length})</h3>
        <input ref={input} type="file" accept="image/jpeg,.jpg,.jpeg" multiple hidden aria-label="Добавить фотографии"
            disabled={busy} onChange={event => {
                const files = Array.from(event.target.files || []); event.target.value = "";
                if (!files.length) return;
                if (files.length > 20 || files.some(file => file.size > 8 * 1024 ** 2)) {
                    setError("Выберите до 20 фото, каждое размером не более 8 МБ."); return;
                }
                void perform(async () => (await fetchActors.addPhotos(accessToken, actorId, files)).photos);
            }} />
        <button type="button" className="btn" disabled={busy} onClick={() => input.current?.click()}>Добавить фото</button>
        <p role="status" className="actor-photo-status">{busy ? "Сохранение…" : status}</p>
        {error && <p role="alert" className="actor-photo-error">{error}</p>}
        {photos.length === 0 && <p>Фотографий нет</p>}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
            if (over && !locked.current) move(photos.indexOf(String(active.id)), photos.indexOf(String(over.id)));
        }}>
            <SortableContext items={photos} strategy={rectSortingStrategy}>
                <ul className="actor-photo-grid">
                    {photos.map((id, index) => <Photo key={id} id={id} index={index} total={photos.length} baseUrl={baseUrl}
                        busy={busy} onMove={direction => move(index, index + direction)} onDelete={() => {
                            if (locked.current || !window.confirm(`Удалить фото ${index + 1}?`)) return;
                            void perform(async () => { await fetchActors.deletePhoto(accessToken, actorId, id); return photos.filter(photo => photo !== id); });
                        }} />)}
                </ul>
            </SortableContext>
        </DndContext>
    </section>;
}
