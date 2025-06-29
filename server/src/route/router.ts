import express, { Express, Request, Response } from "express";
import actorRouter from "./actorRouter";
import agentRouter from "./agentRouter";

const router: Express = express();

router.use('/actor', actorRouter)
router.use('/agent', agentRouter)

export default router;