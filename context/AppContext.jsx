"use client"

import { useSession } from "next-auth/react"
import { createContext, useContext } from "react"

export const AppContext = createContext()

export const useAppContext = () => {
  return useContext(AppContext)
}

export const AppContextProvider = ({ children }) => {
  const { data: session } = useSession()
  const user = session?.user
  const value = {
    user,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}