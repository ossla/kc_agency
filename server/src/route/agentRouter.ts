import express, { Express } from "express"
import { check } from "../middleware/checkMiddleware"
import { create } from "../controller/agentController/createAgent"
import { remove } from "../controller/agentController/removeAgent"
import { getAll, getOne, getShort } from "../controller/agentController/getAgent"
import { auth } from "../controller/agentController/loginAgent"
import { edit } from "../controller/agentController/editAgent"


const agentRouter: Express = express()

agentRouter.post("/create", /**check,*/ create)
agentRouter.post("/delete", check, remove)
agentRouter.post("/edit", check, edit)

agentRouter.get("/auth", check, auth)
agentRouter.get("/:id", getOne)
agentRouter.get("/", getShort)

export default agentRouter