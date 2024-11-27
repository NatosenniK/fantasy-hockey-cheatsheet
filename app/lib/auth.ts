'use server'

import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { SessionPayload } from './user.types'

const secretKey = 'secret'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: JWTPayload) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
	const { payload } = await jwtVerify(input, key, {
		algorithms: ['HS256'],
	})
	return payload as SessionPayload // Use type assertion to ensure TypeScript understands the structure
}

export async function logout() {
	// Destroy the session
	const cookiesObj = await cookies()
	cookiesObj.set('session', '', { expires: new Date(0) })
}

export async function getSession() {
	const cookiesObj = await cookies()
	const session = cookiesObj.get('session')?.value
	if (!session) return null
	return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
	const session = request.cookies.get('session')?.value
	if (!session) return

	const parsed = await decrypt(session)

	// Update the expiration time
	parsed.expires = new Date(Date.now() + 10 * 1000).toISOString()

	// Create the response and update the cookie
	const res = NextResponse.next()
	res.cookies.set({
		name: 'session',
		value: await encrypt(parsed),
		httpOnly: true,
		expires: new Date(parsed.expires),
	})

	return res
}
