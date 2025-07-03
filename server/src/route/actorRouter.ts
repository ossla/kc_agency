import express, { Express } from "express";
import { check } from "../middleware/checkMiddleware";
import actorController from "../controller/actorController";
// import { check } from "../middleware/checkMiddleware";


const actorRouter: Express = express();

actorRouter.post("/create", check, actorController.create)
actorRouter.post("/delete", check, actorController.delete);
actorRouter.get("/:id", actorController.getOne)
actorRouter.get("/", actorController.getAll)

export default actorRouter;
