import express, { Express } from "express";
// import { check } from "../middlewares/checkMiddleware";
import agentController from "../controller/agentController";


const agentRouter: Express = express();

agentRouter.post("/create", agentController.create)
agentRouter.get("/:id", agentController.getOne)
agentRouter.get("/", agentController.getAll)

export default agentRouter;
