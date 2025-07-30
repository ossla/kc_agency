import { useState } from "react"

interface PhotosAlbumProps {
    photos: string[]
    directory: string
    actorId: number
    onUpdate: (updatedPhotos: string[]) => void
}

export default function AlbumPhotos({ photos, directory, actorId, onUpdate }: PhotosAlbumProps) {
    
}
