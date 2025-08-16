import { ICity, toICity } from "../interfaces/ICity"
import { IEyeColor, toIEyeColor } from "../interfaces/IEyeColor"
import { ILanguage, toILanguage } from "../interfaces/ILanguage"
import { cityURL, eyeURL, languageURL } from "./url"

class fetchRelevant {
    static async getCities() : Promise<ICity[]> {
        const response = await fetch(cityURL, { method: "GET" })
        const data = await response.json()
        return data.map(toICity)
    }

    static async getEyeColors() : Promise<IEyeColor[]> {
        const response = await fetch(eyeURL, { method: "GET" })
        const data = await response.json()
        return data.map(toIEyeColor)
    }

    static async getLanguages() : Promise<ILanguage[]> {
        const response = await fetch(languageURL, { method: "GET" })
        const data = await response.json()
        return data.map(toILanguage)
    }
}

export default fetchRelevant