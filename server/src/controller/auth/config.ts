import dotenv from "dotenv"
import { RefreshToken } from "../../models/refreshToken.entity"
import { appDataSource } from "../../data-source"
dotenv.config()

export const refreshRepo = () => appDataSource.getRepository(RefreshToken)

export const SALT_ROUNDS: number = 5

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
export const REFRESH_TOKEN_PEPPER = process.env.REFRESH_TOKEN_PEPPER
export const ACCESS_TOKEN_EXPIRES_IN = "10m"
export const REFRESH_TOKEN_EXPIRES_DAYS = 10
export const REFRESH_TOKEN_EXPIRES_MS = REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000;
export const COOKIE_NAME = "jid"
