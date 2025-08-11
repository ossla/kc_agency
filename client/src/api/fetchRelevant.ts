import { ICity, toICity } from "../models/ICity"
import { IEyeColor, toIEyeColor } from "../models/IEyeColor"
import { ILanguage, toILanguage } from "../models/ILanguage"

class fetchRelevant {
    static async getCities() : Promise<ICity[]> {
        const response = await fetch("http://localhost:3001/api/relevant/city/", { method: "GET" })
        const data = await response.json()
        return data.map(toICity)
    }

    static async getEyeColors() : Promise<IEyeColor[]> {
        const response = await fetch("http://localhost:3001/api/relevant/eye/", { method: "GET" })
        const data = await response.json()
        return data.map(toIEyeColor)
    }

    static async getLanguages() : Promise<ILanguage[]> {
        const response = await fetch("http://localhost:3001/api/relevant/language/", { method: "GET" })
        const data = await response.json()        
        return data.map(toILanguage)
    }
}

export default fetchRelevant