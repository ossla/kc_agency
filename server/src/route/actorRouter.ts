import express, { Express } from "express";
import { check } from "../middleware/checkMiddleware";
import { create } from "../controller/actorController/createActor";
import { remove } from "../controller/actorController/removeActor";
import { getAllFull, getAllShort, getOne } from "../controller/actorController/getActor";
import { filter } from "../controller/actorController/filterActor";


const actorRouter: Express = express();

actorRouter.post("/create", check, create)
actorRouter.post("/delete", check, remove)
actorRouter.get("/:id", getOne)
actorRouter.get("/", getAllShort)
actorRouter.post("/filter", filter)
actorRouter.get("/getAll", getAllFull) // для тестов...

export default actorRouter;
