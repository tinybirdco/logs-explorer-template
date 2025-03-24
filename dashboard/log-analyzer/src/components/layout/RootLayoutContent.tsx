'use client'

import { ReactNode, useEffect } from 'react'
import { useTinybirdToken } from '../../app/providers/TinybirdProvider'

interface RootLayoutContentProps {
  children: ReactNode
  initialToken: string
  initialOrgName: string
}

export function RootLayoutContent({ children, initialToken, initialOrgName }: RootLayoutContentProps) {
  const { setToken, setOrgName } = useTinybirdToken()

  useEffect(() => {
    setToken(initialToken)
    setOrgName(initialOrgName)
  }, [initialToken, initialOrgName, setToken, setOrgName])

  return <>{children}</>
} 