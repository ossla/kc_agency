import express, { Express } from "express";
// import { check } from "../middlewares/checkMiddleware";
import agentController from "../controller/agentController";
import { check } from "../middleware/checkMiddleware";


const agentRouter: Express = express();

agentRouter.post("/create", agentController.create)
agentRouter.post("/delete", check, agentController.delete)
agentRouter.get("/auth", check, (req, res) => {
    res.status(200).json({message: true});
});
agentRouter.get("/:id", agentController.getOne)
agentRouter.get("/", agentController.getAll)

export default agentRouter;
