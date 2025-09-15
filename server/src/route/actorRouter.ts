import express, { Express } from "express"
import { checkMiddleware } from "../middleware/checkMiddleware"
import { createActor } from "../controller/actor/createActor"
import { removeActor } from "../controller/actor/removeActor"
import { getAllFullActors, getOneActor, getShortActors, getShortMenActors, getShortWomenActors} from "../controller/actor/getActor"
import { filterActor } from "../controller/actor/filterActor"
import { editActor } from "../controller/actor/editActor"
import { changeAvatar, changeOrder, deletePhoto } from "../controller/actor/editPhotosActor"
import { authMiddleware } from "../middleware/authMiddleware"


const actorRouter: Express = express()

actorRouter.post("/create", authMiddleware, checkMiddleware, createActor)
actorRouter.delete("/delete/:id", authMiddleware, checkMiddleware, removeActor)
actorRouter.post("/edit", authMiddleware, checkMiddleware, editActor)
actorRouter.post("/edit/changeAvatar", authMiddleware, checkMiddleware, changeAvatar)
actorRouter.post("/edit/changeOrder", authMiddleware, checkMiddleware, changeOrder)
actorRouter.post("/edit/deleteFromAlbum", authMiddleware, checkMiddleware, deletePhoto)

actorRouter.post("/filter", filterActor)
actorRouter.get("/:id", getOneActor)
actorRouter.get("/get/men", getShortMenActors)
actorRouter.get("/get/women", getShortWomenActors)
actorRouter.get("/", getShortActors)


export default actorRouter
