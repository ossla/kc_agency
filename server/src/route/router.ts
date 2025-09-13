import express, { Express, Request, Response } from "express";
import actorRouter from "./actorRouter";
import agentRouter from "./agentRouter";
import relevantRouter from "./relevantRoutes";
import userRouter from "./userRouter";

const router: Express = express();

router.use('/actor', actorRouter)
router.use('/agent', agentRouter)
router.use('/relevant', relevantRouter)
router.use('/auth', userRouter)

export default router;