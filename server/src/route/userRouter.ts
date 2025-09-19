import express, { Express } from "express"

import { logout } from "../controller/auth/logout"
import { login } from "../controller/auth/login"
import { registration } from "../controller/auth/registration"
import { auth } from "../controller/auth/auth"
import { addFavorite, getFavorites, removeFavorite } from "../controller/auth/favorites"
import { authMiddleware } from "../middleware/authMiddleware"
import { getUser } from "../controller/auth/getUser"


const userRouter: Express = express()

userRouter.post("/", authMiddleware, auth)
userRouter.post("/registration", registration)
userRouter.post("/login", login)
userRouter.post("/logout", authMiddleware, logout)
userRouter.get("/:id", authMiddleware, getUser)

userRouter.post("/:userId/favorites/:actorId", authMiddleware, addFavorite)
userRouter.delete("/:userId/favorites/:actorId", authMiddleware, removeFavorite)
userRouter.get("/:userId/favorites", authMiddleware, getFavorites)

export default userRouter