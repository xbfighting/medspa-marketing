import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

const alg = 'HS256'

export interface UserJWT {
  user: string
  expires: number
}

export async function encrypt(payload: UserJWT) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret)
}

export async function decrypt(token: string): Promise<UserJWT | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [alg],
    })
    return payload as unknown as UserJWT
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  
  if (!token) return null
  
  return await decrypt(token.value)
}

export async function createSession(user: string) {
  const expires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  const session = await encrypt({ user, expires })
  
  const cookieStore = await cookies()
  cookieStore.set('auth-token', session, {
    expires: new Date(expires),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

// Simple credential check - replace with proper authentication later
export function verifyCredentials(username: string, password: string): boolean {
  // You can set these in environment variables
  const validUsername = process.env.AUTH_USERNAME || 'admin'
  const validPassword = process.env.AUTH_PASSWORD || 'medspa2024'
  
  return username === validUsername && password === validPassword
}