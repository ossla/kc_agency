export interface IUser {
    id: number
    name: string
    email: string
    isAdmin: boolean
}

export interface IAuthorized {
    accessToken: string
    user: IUser
}