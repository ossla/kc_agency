import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import fetchActors from "../api/fetchActors";

type Props = {
    actorId: string
    initialPhotos: string[]
    baseUrl: string
    accessToken: string
    onChange: (photos: string[]) => void
}

function SortablePhoto({ id, baseUrl, onDelete }: {
    id: string
    baseUrl: string
    onDelete: (id: string) => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} className="photo_item">
            <img
                {...attributes}
                {...listeners}
                src={`${baseUrl}/${id}_400.jpg`}
                className="photo_img"
            />

            <button
                className="photo_delete"
                onClick={() => onDelete(id)}
            >
                ✕
            </button>
        </div>
    );
}

export default function ActorPhotoEditor({
    actorId,
    initialPhotos,
    baseUrl,
    accessToken,
    onChange
}: Props) {

    const [photos, setPhotos] = useState<string[]>(initialPhotos)

    const sensors = useSensors(useSensor(PointerSensor))

    // drag & drop reorder
    const handleDragEnd = async (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = photos.indexOf(active.id)
        const newIndex = photos.indexOf(over.id)

        const newPhotos = arrayMove(photos, oldIndex, newIndex)
        setPhotos(newPhotos)

        onChange(newPhotos)

        try {
            await fetchActors.changeOrder(accessToken, actorId, newPhotos)
        } catch (e) {
            console.error(e)
        }
    }

    // delete photo
    const handleDelete = async (photoId: string) => {
        try {
            await fetchActors.deletePhoto(accessToken, actorId, photoId)

            const newPhotos = photos.filter(p => p !== photoId)
            setPhotos(newPhotos)

            onChange(newPhotos)
        } catch (e) {
            console.error(e)
        }
    }

    // upload multiple photos
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const files = Array.from(e.target.files)

        try {
            const updatedActor = await fetchActors.addPhotos(
                accessToken,
                actorId,
                files
            )

            setPhotos(updatedActor.photos)
            onChange(updatedActor.photos)

            e.target.value = "" // сброс input
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <h3>Редактирование фото</h3>

            <input
                type="file"
                multiple
                onChange={handleUpload}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={photos}
                    strategy={rectSortingStrategy}
                >
                    <div className="photo_grid">
                        {photos.map(p => (
                            <SortablePhoto
                                key={p}
                                id={p}
                                baseUrl={baseUrl}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}