'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TinybirdContextType {
  token: string
  orgName: string
  setToken: (token: string) => void
  setOrgName: (orgName: string) => void
}

const TinybirdContext = createContext<TinybirdContextType | undefined>(undefined)

interface TinybirdProviderProps {
  children: ReactNode
  initialToken: string
  initialOrgName?: string
}

export function TinybirdProvider({ children, initialToken, initialOrgName = '' }: TinybirdProviderProps) {
  // If no token is provided, use the public API key
  const defaultToken = initialToken || process.env.NEXT_PUBLIC_TINYBIRD_API_KEY || '';
  const [token, setToken] = useState(defaultToken);
  const [orgName, setOrgName] = useState(initialOrgName);

  return (
    <TinybirdContext.Provider value={{ token, orgName, setToken, setOrgName }}>
      {children}
    </TinybirdContext.Provider>
  )
}

export function useTinybirdToken() {
  const context = useContext(TinybirdContext)
  if (context === undefined) {
    throw new Error('useTinybirdToken must be used within a TinybirdProvider')
  }
  return context
}