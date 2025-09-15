import express, { Express } from "express"
import { checkMiddleware } from "../middleware/checkMiddleware"
import { createAgent } from "../controller/agent/createAgent"
import { removeAgent } from "../controller/agent/removeAgent"
import { getAllAgents, getOneAgent, getShortAgents } from "../controller/agent/getAgent"
import { editAgent } from "../controller/agent/editAgent"
import { authMiddleware } from "../middleware/authMiddleware"

const agentRouter: Express = express()

agentRouter.post("/create", authMiddleware, checkMiddleware, createAgent)
agentRouter.delete("/delete/:id", authMiddleware, checkMiddleware, removeAgent)
agentRouter.post("/edit", authMiddleware, checkMiddleware, editAgent)

agentRouter.get("/:id", getOneAgent)
agentRouter.get("/", getShortAgents)

export default agentRouter