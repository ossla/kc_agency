export interface ActorVideo {
    id: string
    url: string
    name: string
}

export function actorVideos(actor: { videos?: ActorVideo[], videoURL?: string }): ActorVideo[] {
    if (actor.videos?.length) return actor.videos
    return actor.videoURL ? [{ id: "legacy", url: actor.videoURL, name: "Видео 1" }] : []
}
