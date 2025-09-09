import express, { Express } from "express"
import { logout } from "../controller/auth/logout"
import { login } from "../controller/auth/login"
import { registration } from "../controller/auth/registration"
import { auth } from "../controller/auth/auth"
import { authMiddleware } from "../middleware/authMiddleware"

const authRouter: Express = express()

authRouter.post("/register", registration)
authRouter.post("/auth", authMiddleware, auth)
authRouter.post("/login", login)
authRouter.post("/logout", logout)

export default authRouter