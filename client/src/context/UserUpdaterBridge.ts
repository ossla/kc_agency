import { IUser } from "../api/types/userTypes"

type setUserFunctionType = ((u: IUser | null) => void) | null
type setAccessFunctionType = ((t: string | null) => void) | null

let _setUser: setUserFunctionType = null
let _setAccessToken: setAccessFunctionType = null


export function initUserContextBridge(
  setUser: setUserFunctionType,
  setAccessToken: setAccessFunctionType
) {
  _setUser = setUser
  _setAccessToken = setAccessToken
}

export function updateUser(user: IUser, token: string) {
  _setUser?.(user)
  _setAccessToken?.(token)
}

export function clearUser() {
  _setUser?.(null)
  _setAccessToken?.(null)
}
