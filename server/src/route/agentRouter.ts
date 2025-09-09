import express, { Express } from "express"
import { checkMiddleware } from "../middleware/checkMiddleware"
import { create } from "../controller/agent/createAgent"
import { remove } from "../controller/agent/removeAgent"
import { getAll, getOne, getShort } from "../controller/agent/getAgent"
import { edit } from "../controller/agent/editAgent"

const agentRouter: Express = express()

// agentRouter.post("/registration", check, create)
// agentRouter.post("/delete", check, remove)
// agentRouter.post("/edit", check, edit)
// agentRouter.get("/auth", check, auth)

agentRouter.post("/create", create)
agentRouter.post("/delete", remove)
agentRouter.post("/edit", edit)

agentRouter.get("/:id", getOne)
agentRouter.get("/", getShort)

export default agentRouter