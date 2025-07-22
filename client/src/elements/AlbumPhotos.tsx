import { useState } from "react"

interface PhotosAlbumProps {
    photos: string[]
    directory: string
    actorId: number
    onUpdate: (updatedPhotos: string[]) => void
}

export default function AlbumPhotos({ photos, directory, actorId, onUpdate }: PhotosAlbumProps) {
    const [loading, setLoading] = useState(false)

    const deletePhoto = async (photoIdx: number) => {
        setLoading(true)
        try {
            const res = await fetch("http://localhost:3001/api/actor/edit/deleteFromAlbum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: actorId, photoIdx })
            })

            const updatedActor = await res.json()
            onUpdate(updatedActor.photos)
        } catch (err) {
            console.error("Ошибка при удалении", err)
        } finally {
            setLoading(false)
        }
    }

    const changeOrder = async (currIdx: number, putAfterIdx: number) => {
        setLoading(true)
        try {
            const res = await fetch("http://localhost:3001/api/actor/edit/changeOrder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: actorId, currIdx, putAfterIdx })
            })

            const updatedActor = await res.json()
            onUpdate(updatedActor.photos)
        } catch (err) {
            console.error("Ошибка при смене порядка", err)
        } finally {
            setLoading(false)
        }
    }

    if (!photos || photos.length === 0) return <p>Loading...</p>

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {photos.map((photo, i) => (
                <div key={i} className="relative group border p-1 rounded">
                    <img
                        src={`http://localhost:3001/${directory}/${photo}`}
                        alt={`Фото ${i + 1}`}
                        className="w-full h-40 object-cover rounded"
                    />
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                            onClick={() => deletePhoto(i)}
                            className="text-white bg-red-600 text-xs px-2 py-0.5 rounded"
                            disabled={loading}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex justify-between mt-1 text-xs">
                        <button
                            onClick={() => i > 0 && changeOrder(i, i - 2)}
                            disabled={loading || i === 0}
                            className="text-blue-600 hover:underline disabled:opacity-30"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => i < photos.length - 1 && changeOrder(i, i)}
                            disabled={loading || i === photos.length - 1}
                            className="text-blue-600 hover:underline disabled:opacity-30"
                        >
                            →
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
