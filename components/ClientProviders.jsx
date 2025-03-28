"use client"

import { SessionProvider } from 'next-auth/react'
import { AppContextProvider } from '@/context/AppContext'

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <AppContextProvider>
        {children}
      </AppContextProvider>
    </SessionProvider>
  )
}