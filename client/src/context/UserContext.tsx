// src/context/UserContext.tsx
import { createContext, useContext, useState } from "react"
import { IUser } from "../api/types/userTypes"
import { initUserContextBridge } from "./UserUpdaterBridge"

interface UserContextType {
  user: IUser | null
  setUser: (user: IUser | null) => void
  accessToken: string | null
  setAccessToken: (token: string | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

// компонент позволяет уменьшить количество кода в app.tsx
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  initUserContextBridge(setUser, setAccessToken)

  return (
    <UserContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>
      {children}
    </UserContext.Provider>
  )
}

// чтобы каждый раз не писать throw new Error...
export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser должен находиться под UserProvider")
  return ctx
}
