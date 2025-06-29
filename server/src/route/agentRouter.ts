import express, { Express } from "express";
// import { check } from "../middlewares/checkMiddleware";
import agentController from "../controller/agentController";


const agentRouter: Express = express();
const controller: agentController = new agentController();

agentRouter.get("/:id", agentController.getOne)
agentRouter.get("/", agentController.getAll)

export default agentRouter;
