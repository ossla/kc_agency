import express, { Express } from "express";
import { check } from "../middleware/checkMiddleware";
import { create } from "../controller/actorController/createActor";
import { remove } from "../controller/actorController/removeActor";
import { getAllFull, getOne, getShortMen, getShortWomen } from "../controller/actorController/getActor";
import { filter } from "../controller/actorController/filterActor";


const actorRouter: Express = express();

actorRouter.post("/create", check, create)
actorRouter.post("/delete", check, remove)
actorRouter.get("/:id", getOne)
actorRouter.get("/men", getShortMen)
actorRouter.get("/women", getShortWomen)
actorRouter.post("/filter", filter)
actorRouter.get("/", getAllFull) // для тестов...

export default actorRouter;
