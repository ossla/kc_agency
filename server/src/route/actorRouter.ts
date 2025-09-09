import express, { Express } from "express"
import { checkMiddleware } from "../middleware/checkMiddleware"
import { create } from "../controller/actor/createActor"
import { remove } from "../controller/actor/removeActor"
import { getAllFull, getOne, getShort, getShortMen, getShortWomen} from "../controller/actor/getActor"
import { filter } from "../controller/actor/filterActor"
import { edit } from "../controller/actor/editActor"
import { changeAvatar, changeOrder, deletePhoto } from "../controller/actor/editPhotosActor"


const actorRouter: Express = express()

// actorRouter.post("/create", check, create)
// actorRouter.post("/delete", check, remove)
// actorRouter.post("/edit", check, edit)
// actorRouter.post("/edit/changeAvatar", check, changeAvatar)
// actorRouter.post("/edit/changeOrder", check, changeOrder)
// actorRouter.post("/edit/deleteFromAlbum", check, deletePhoto)

actorRouter.post("/create", create)
actorRouter.post("/delete", remove)
actorRouter.post("/edit", edit)
actorRouter.post("/edit/changeAvatar", changeAvatar)
actorRouter.post("/edit/changeOrder", changeOrder)
actorRouter.post("/edit/deleteFromAlbum", deletePhoto)

actorRouter.post("/filter", filter)
actorRouter.get("/:id", getOne)
actorRouter.get("/get/men", getShortMen)
actorRouter.get("/get/women", getShortWomen)
actorRouter.get("/", getShort)


export default actorRouter
