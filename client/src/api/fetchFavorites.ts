import { ResponseHandler, ResponseHandlerMap } from "./ResponseHandler"
import { IShortActor, toIShortActor,  } from "./types/actorTypes"
import { serverURL } from "./URLs"


class fetchFavorites {
    // ================== POST ==================
    static async add(userId: number, actorId: number, accessToken: string): Promise<boolean> {
        const favoritesURL = serverURL + "/api/auth/" + userId + "/favorites/" + actorId
        const response = await fetch(favoritesURL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })

        return response.ok
    }

    // ================== GET ==================
    static async get(userId: number, accessToken: string): Promise<IShortActor[]> {
        const favoritesURL = serverURL + "/api/auth/" + userId + "/favorites/"
        const response = await fetch(favoritesURL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })

        const data: IShortActor[] = await ResponseHandlerMap<IShortActor>(response, toIShortActor)
        return data
    }

    // ================== DELETE ==================
    static async remove(userId: number, actorId: number, accessToken: string): Promise<boolean> {
        const favoritesURL = serverURL + "/api/" + userId + "/favorites/" + actorId
        const response = await fetch(favoritesURL, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        })

        return response.ok
    }
}

export default fetchFavorites