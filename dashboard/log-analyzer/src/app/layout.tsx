import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { TinybirdProvider } from './providers/TinybirdProvider'
import './globals.css'
import { TooltipProvider } from '@radix-ui/react-tooltip'
const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const token = headersList.get('x-tinybird-token') || ''
  const orgName = headersList.get('x-org-name') || ''

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <TinybirdProvider initialToken={token} initialOrgName={orgName}>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </TinybirdProvider>
        </ClerkProvider>
      </body>
    </html>
  )
} 