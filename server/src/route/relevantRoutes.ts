import express, { Express } from "express"
import { getCities, getCity, removeCity } from "../controller/relevantControllers/citiy"
import { getEyeColor, getEyeColors, removeEyeColor } from "../controller/relevantControllers/eyeColor"
import { getLanguage, getLanguages, removeLanguage } from "../controller/relevantControllers/language"

const relevantRouter: Express = express()

relevantRouter.get("/city", getCities)
relevantRouter.get("/city/:id", getCity)
relevantRouter.post("/city/delete", removeCity)

relevantRouter.get("/eye", getEyeColors)
relevantRouter.get("/eye/:id", getEyeColor)
relevantRouter.post("/eye/delete", removeEyeColor)

relevantRouter.get("/language", getLanguages)
relevantRouter.get("/language/:id", getLanguage)
relevantRouter.post("/language/delete", removeLanguage)

export default relevantRouter
