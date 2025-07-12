import express, { Express } from "express";
import { check } from "../middleware/checkMiddleware";
import { create } from "../controller/actorController/createActor";
import { remove } from "../controller/actorController/removeActor";
import { getAll, getOne } from "../controller/actorController/getActor";
import { filter } from "../controller/actorController/filterActor";


const actorRouter: Express = express();

actorRouter.post("/create", check, create)
actorRouter.post("/delete", check, remove)
actorRouter.get("/:id", getOne)
actorRouter.get("/", getAll)
actorRouter.post("/filter", filter)

export default actorRouter;
