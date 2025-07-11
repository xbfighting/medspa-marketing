import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip auth for login page and auth API
  if (pathname === '/login' || pathname === '/api/auth/login') {
    return NextResponse.next()
  }
  
  // Skip auth for static files
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Check for auth token
  const token = request.cookies.get('auth-token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Verify token
  const session = await decrypt(token.value)
  
  if (!session || session.expires < Date.now()) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)',
  ],
}