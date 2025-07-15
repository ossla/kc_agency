import express, { Express } from "express";
// import { check } from "../middlewares/checkMiddleware";
import { check } from "../middleware/checkMiddleware";
import { create } from "../controller/agentController/createAgent";
import { remove } from "../controller/agentController/removeAgent";
import { getAll, getOne } from "../controller/agentController/getAgent";
import { auth } from "../controller/agentController/loginAgent";


const agentRouter: Express = express();

agentRouter.post("/create", /**check,*/ create)
agentRouter.post("/delete", check, remove)
agentRouter.get("/auth", check, (req, res) => {
    res.status(200).json({message: true});
});
agentRouter.get("/:id", getOne)
agentRouter.get("/", getAll)
agentRouter.get("/auth", check, auth)

export default agentRouter;
