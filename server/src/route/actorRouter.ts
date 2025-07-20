import express, { Express } from "express"
import { check } from "../middleware/checkMiddleware"
import { create } from "../controller/actorController/createActor"
import { remove } from "../controller/actorController/removeActor"
import { getAllFull, getOne, getShortMen, getShortWomen } from "../controller/actorController/getActor"
import { filter } from "../controller/actorController/filterActor"
import { edit } from "../controller/actorController/editActor"
import { changeAvatar, changeOrder, deletePhoto } from "../controller/actorController/editPhotosActor"


const actorRouter: Express = express()

actorRouter.post("/create", check, create)
actorRouter.post("/delete", check, remove)
actorRouter.post("/edit", check, edit)
actorRouter.post("/edit/changeAvatar", check, changeAvatar)
actorRouter.post("/edit/changeOrder", check, changeOrder)
actorRouter.post("/edit/deleteFromAlbum", check, deletePhoto)

actorRouter.post("/filter", filter)
actorRouter.get("/:id", getOne)
actorRouter.get("/get/men", getShortMen)
actorRouter.get("/get/women", getShortWomen)
actorRouter.get("/", getAllFull)


export default actorRouter
