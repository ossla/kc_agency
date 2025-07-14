export interface IAgent {
    id: number,
    first_name: string,
    last_name: string,
    middle_name?: string,
    email: string,
    phone: string,
    description?: string,
    photo_name: string,
    telegram?: string,
    VK?: string,
    is_admin: boolean,
    createdAt: Date,
    updatedAt: Date
}