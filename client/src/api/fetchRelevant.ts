import { ICity, IEyeColor, ILanguage, toICity, toIEyeColor, toILanguage } from "./types/relevantTypes"
import { cityURL, eyeURL, languageURL } from "./URLs"

class fetchRelevant {
    // ================== CREATE ==================
    // ================== EDIT ==================
    // ================== DELETE ==================
    // ================== GET ==================
    static async getCities() : Promise<ICity[]> {
        const response = await fetch(cityURL, { method: "GET" })
        console.log(response);
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