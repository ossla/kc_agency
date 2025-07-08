import express, { Express } from "express";
import { check } from "../middleware/checkMiddleware";
import { create } from "../controller/actorController/createActor";
import { remove } from "../controller/actorController/removeActor";
import { getAll, getOne } from "../controller/actorController/getActor";


const actorRouter: Express = express();

actorRouter.post("/create", check, create)
actorRouter.post("/delete", check, remove)
actorRouter.get("/:id", getOne)
actorRouter.get("/", getAll)

export default actorRouter;
