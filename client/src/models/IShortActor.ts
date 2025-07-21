export interface IShortActor {
    id: number,
    firstName: string,
    lastName: string,
    directory: string,
    avatarUrl: string
}

export function toIShortActor(raw: any): IShortActor{
    return {
        id: raw.id,
        firstName: raw.firstName,
        lastName: raw.lastName,
        directory: raw.directory,
        avatarUrl: `http://localhost:3001/${raw.directory}/avatar.jpg`
    }
}