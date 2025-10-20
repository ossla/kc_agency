import { createContext, useContext, useState } from "react"
import { IUser } from "../api/types/userTypes"


interface UserContextType {
  user: IUser | null
  setUser: (user: IUser | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser должен находиться под UserContext.Provider")
  return ctx
}
