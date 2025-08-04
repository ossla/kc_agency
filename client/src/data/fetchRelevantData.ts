
class fetchActors {
    static async getCities() {

    }

    static async getEyeColors() {

    }

    static async getLanguages() {
        const res = await fetch("http://localhost:3001/api/actor/filter")
    }
    // static async fetchFiltered() {
    //     const res = await fetch("http://localhost:3001/api/actor/filter", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(filters)
    //     })
    //     const data = await response.json()

    // }
}

export default fetchActors