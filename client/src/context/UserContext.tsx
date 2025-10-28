import { createContext, useContext, useEffect, useState } from "react"
import { IUser } from "../api/types/userTypes"
import { initUserContextBridge } from "./UserUpdaterBridge"
import { useLocation } from "react-router-dom"
import fetchAuth from "../api/fetchAuth"

interface UserContextType {
    user: IUser | null
    setUser: (user: IUser | null) => void
    accessToken: string | null
    setAccessToken: (token: string | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

async function authenticate() {
    try {
        await fetchAuth.auth()
    } catch (err) {
        console.error(err)
    }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const location = useLocation()

    useEffect(() => {
        authenticate()
    }, [location.pathname])

    const [user, setUser] = useState<IUser | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)

    useEffect(() => {
        initUserContextBridge(setUser, setAccessToken)
    }, [])

    return (
        <UserContext.Provider value={{  user
								        ,setUser
									    ,accessToken
									    , setAccessToken }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error("useUser должен находиться под UserProvider")
    return ctx
}
