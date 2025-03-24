import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import * as jose from 'jose'

export default clerkMiddleware(async (auth) => {
  const authentication = await auth()
  const { userId, sessionId, orgPermissions } = authentication

  // If user is not authenticated, continue without modification
  if (!userId || !sessionId) {
    console.log('No user or session found')
    const response = NextResponse.next()
    response.headers.set('x-tinybird-token', process.env.NEXT_PUBLIC_TINYBIRD_API_KEY || '')
    return response
  }

  try {
    const orgName = orgPermissions?.[0]?.split(':').pop() || ''

    // Create Tinybird JWT
    const secret = new TextEncoder().encode(process.env.TINYBIRD_JWT_SECRET)
    const token = await new jose.SignJWT({
      workspace_id: process.env.TINYBIRD_WORKSPACE_ID,
      name: `frontend_jwt_user_${userId}`,
      exp: Math.floor(Date.now() / 1000) + (60 * 15), // 15 minute expiration
      iat: Math.floor(Date.now() / 1000),
      scopes: [
        {
          type: "PIPES:READ",
          resource: "log_analysis",
          fixed_params: { user_id: userId, org_permission: orgName, service: "web" }
        },
        {
          type: "PIPES:READ",
          resource: "log_explorer",
          fixed_params: { user_id: userId, org_permission: orgName, service: "web" }
        },
        {
          type: "PIPES:READ",
          resource: "generic_counter",
          fixed_params: { user_id: userId, org_permission: orgName, service: "web" }
        },
        {
          type: "PIPES:READ",
          resource: "log_timeseries",
          fixed_params: { user_id: userId, org_permission: orgName, service: "web" }
        }
      ],
      limits: {
        rps: 10
      }
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret)

    // Clone the response and add token
    const response = NextResponse.next()
    response.headers.set('x-tinybird-token', token)
    response.headers.set('x-org-name', orgName)
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    const response = NextResponse.next()
    response.headers.set('x-tinybird-token', process.env.NEXT_PUBLIC_TINYBIRD_API_KEY || '')
    return response
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 