import { ResponseHandler, ResponseHandlerMap } from "./ResponseHandler";
import { FilterActorType, IActor, IShortActor, toIActor, toIShortActor } from "./types/actorTypes";
import { GenderEnum } from "./types/enums";
import { addPhotoToAlbumURL, changeAvatarURL, changeOrderAlbumURL, createActorURL, deleteActorURL, deletePhotoFromAlbumURL, editActorURL, filterActorsURL, getActorsURL, getMenActorsURL, getWomenActorsURL } from "./URLs";


class fetchActors {
    // ================== CREATE ==================
    static async create(accessToken: string, reqFormData: FormData): Promise<IActor> {
        const response = await fetch(createActorURL, {
            method: "POST",
            body: reqFormData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })
        const actor: IActor = await ResponseHandler<IActor>(response, toIActor)
        return actor
    }
    // ================== EDIT ==================
    // ================== DELETE ==================
    // ================== GET ==================
    static async getShort(): Promise<IShortActor[]> {
        const response = await fetch(getActorsURL, {method: "GET"})

        const actors: IShortActor[] = await ResponseHandlerMap<IShortActor>(response, toIShortActor)
        console.log("getShort data: " + JSON.stringify(actors))
        return actors
    }

    static async getShortByGender(gender: GenderEnum): Promise<IShortActor[]> {
        const response = await fetch(
                    gender === GenderEnum.man ? getMenActorsURL : getWomenActorsURL
                    , {method: "GET"})
        const actors: IShortActor[] = await ResponseHandlerMap<IShortActor>(response, toIShortActor)            
        console.log("getShort data: " + JSON.stringify(actors))
        return actors
    }

    static async getActor(id: string): Promise<IActor> {        
        const response = await fetch(getActorsURL + "/" + id, {method: "GET"})
        const actor: IActor = await ResponseHandler<IActor>(response, toIActor)
        console.log("getActor data: " + JSON.stringify(actor))
        return actor
    }

    static async filterActor(filters: FilterActorType): Promise<IShortActor[]> {
      
        // убирает невыбранные фильтры (поля null)
        const cleanedFilters = Object.fromEntries(
            Object.entries(filters).filter(([k, v]) => v != null)
        )
        
        // гарантия того, что будут отправляться именно массивы айди из таблиц (city, eye, etc.) с клиента
        if (cleanedFilters.cityIds && typeof cleanedFilters.cityIds === "string") {
            cleanedFilters.cityIds = cleanedFilters.cityIds.split(",").map(Number);
        }
        if (cleanedFilters.eyeIds && typeof cleanedFilters.eyeIds === "string") {
            cleanedFilters.eyeIds = cleanedFilters.eyeIds.split(",").map(Number);
        }
        if (cleanedFilters.languageIds && typeof cleanedFilters.languageIds === "string") {
            cleanedFilters.languageIds = cleanedFilters.languageIds.split(",").map(Number);
        }

        const response = await fetch(filterActorsURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cleanedFilters)
        })

        const actors: IShortActor[] = await ResponseHandlerMap<IShortActor>(response, toIShortActor)
        console.log("filtered data: " + JSON.stringify(actors))
        return actors
    }

    static async editActor(accessToken: string, reqFormData: FormData): Promise<IActor> {
        const response = await fetch(editActorURL, {
            method: "POST",
            body: reqFormData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })
        
        const actor: IActor = await ResponseHandler<IActor>(response, toIActor)
        return actor 
    }

    static async deleteActor(accessToken: string, actorID: string) {
        const response = await fetch(deleteActorURL + "/" + actorID, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })

        console.log(response);
    }

    static async addPhotos(accessToken: string, actorId: string, files: File[]): Promise<IActor> {

        const formData = new FormData()
        formData.append("id", actorId)

        files.forEach(file => {
            formData.append("photos", file)
        })

        const response = await fetch(addPhotoToAlbumURL, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })

        const actor: IActor = await ResponseHandler<IActor>(response, toIActor)
        return actor
    }

    static async deletePhoto(accessToken: string, actorId: string, photoId: string): Promise<void> {
        const response = await fetch(deletePhotoFromAlbumURL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: actorId,
                photoId
            })
        })

        await ResponseHandler<string>(response, toString)
    }

    static async changeOrder(accessToken: string, actorId: string, photos: string[]): Promise<void> {
        const response = await fetch(changeOrderAlbumURL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: actorId,
                photos
            })
        })

        await ResponseHandler<string>(response, toString)
    }

    static async changeAvatar(accessToken: string, actorId: string, file: File): Promise<void> {
        const formData = new FormData()
        formData.append("id", actorId)
        formData.append("newAvatar", file)

        const response = await fetch(changeAvatarURL, {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })

        await ResponseHandler<string>(response, toString)
    }
}

export default fetchActors
