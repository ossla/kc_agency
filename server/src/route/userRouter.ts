import express, { Express } from "express"

import { logout } from "../controller/user/logout"
import { login } from "../controller/user/login"
import { registration } from "../controller/user/registration"
import { auth } from "../controller/user/auth"
import { addFavorite, getFavorites, removeFavorite } from "../controller/user/favorites"
import { authMiddleware } from "../middleware/authMiddleware"
import { getUser } from "../controller/user/getUser"


const userRouter: Express = express()

userRouter.post("/registration", registration)
userRouter.post("/auth", auth)
userRouter.post("/login", login)
userRouter.post("/logout", logout)
userRouter.get("/:id", authMiddleware, getUser)

userRouter.post("/:userId/favorites/:actorId", authMiddleware, addFavorite)
userRouter.delete("/:userId/favorites/:actorId", authMiddleware, removeFavorite)
userRouter.get("/:userId/favorites", authMiddleware, getFavorites)

export default userRouter