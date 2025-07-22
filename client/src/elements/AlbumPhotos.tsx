

interface AlbumPhotosProps {
    photos: string[] | undefined
}

export default function AlbumPhotos(props: AlbumPhotosProps) {
        return (
            <>
                { props.photos &&
                <div>
                    
                </div>
                }
            </>
        )
}