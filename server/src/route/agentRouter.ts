import express, { Express } from "express";
// import { check } from "../middlewares/checkMiddleware";
import agentController from "../controller/agentController";
import { check } from "../middleware/checkMiddleware";


const agentRouter: Express = express();

agentRouter.post("/create", check, agentController.create)
agentRouter.post("/delete", check, agentController.delete)
agentRouter.get("/:id", agentController.getOne)
agentRouter.get("/", agentController.getAll)

export default agentRouter;
