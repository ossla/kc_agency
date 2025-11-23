import express, { Express, Request, Response } from "express"
import actorRouter from "./actorRouter"
import employeeRouter from "./employeeRouter"
import relevantRouter from "./relevantRoutes"
import userRouter from "./userRouter"

const router: Express = express()

router.use('/actor', actorRouter)
router.use('/emloyee', employeeRouter)
router.use('/relevant', relevantRouter)
router.use('/auth', userRouter)

export default router