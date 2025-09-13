import express, { Express } from "express"

import { logout } from "../controller/user/logout"
import { login } from "../controller/user/login"
import { registration } from "../controller/user/registration"
import { auth } from "../controller/user/auth"


const userRouter: Express = express()

userRouter.post("/registration", registration)
userRouter.post("/auth", auth)
userRouter.post("/login", login)
userRouter.post("/logout", logout)

export default userRouter