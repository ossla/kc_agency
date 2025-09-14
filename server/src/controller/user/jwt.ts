import jwt from "jsonwebtoken"
import crypto from "crypto"

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_DAYS, REFRESH_TOKEN_EXPIRES_MS, REFRESH_TOKEN_PEPPER } from "./config"
import { User } from "../../models/user.entity"
import { RefreshToken } from "../../models/refreshToken.entity"
import { appDataSource } from "../../data-source"


export const refreshRepo = () => appDataSource.getRepository(RefreshToken)

export function hashToken(token: string) {
    return crypto.createHash("sha256").update(token + REFRESH_TOKEN_PEPPER).digest("hex")
}

export interface IJwtAccessPayload {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
}

export interface IJwtRefreshPayload {
    id: number;
    email: string;
    deviceId: string;
}

export function signAccessToken(payload: IJwtAccessPayload) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN })
}

export function signRefreshToken(payload: IJwtRefreshPayload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRES_DAYS}d`})
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET)
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET)
}

export interface TokenPair {
    refresh: string;
    access: string;
}

// обрабатывает данные юзера, создаёт пару токенов и сохраняет/обновляет refresh данные
export async function createTokens(user: User, stored?: RefreshToken): Promise<TokenPair> {
    const deviceId: string = crypto.randomUUID()
    const accessPayload: IJwtAccessPayload = { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    const refreshPayload: IJwtRefreshPayload = { id: user.id, email: user.email, deviceId }
    const access = signAccessToken(accessPayload)
    const refresh = signRefreshToken(refreshPayload)
    const tokenHash = hashToken(refresh)

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS)

    if (stored) {
        stored.tokenHash = tokenHash
        stored.deviceId = deviceId
        stored.expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS)
        await refreshRepo().save(stored)
    } else {
        const rt = refreshRepo().create({ user, tokenHash, expiresAt })
        await refreshRepo().save(rt)
    }

    return {refresh, access}
}