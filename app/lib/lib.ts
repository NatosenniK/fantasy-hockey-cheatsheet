import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { neon } from '@neondatabase/serverless'

const secretKey = 'secret'
const key = new TextEncoder().encode(secretKey)

interface User {
	email: string
	name: string
	password: string
	id: number
}

interface SafeUser {
	id: number
	email: string
	name: string
}

interface SessionPayload extends JWTPayload {
	user: User
	expires: string // Keep as `string` if it's a serialized date
}

const sql = neon(`${process.env.DATABASE_URL}`)

async function getUser(email: string): Promise<User | undefined> {
	try {
		const result = await sql`SELECT * FROM "user" WHERE email=${email}`

		const user = result[0] as User

		return user
	} catch (error) {
		console.error('Failed to fetch user:', error)
		throw new Error('Failed to fetch user.')
	}
}

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

export async function login(formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string

	if (email && password) {
		const dbUser = await getUser(email)
		if (!dbUser) return null

		const passwordsMatch = await bcrypt.compare(password, dbUser.password)
		if (!passwordsMatch) return null

		const safeUser: SafeUser = {
			id: dbUser.id,
			email: dbUser.email,
			name: dbUser.name,
		}

		// Create the session
		const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
		const session = await encrypt({ user: safeUser, expires })

		// Return a response with the cookie
		const response = NextResponse.json({ success: true })

		const cookiesObj = await cookies()
		cookiesObj.set('session', session, { expires: expires })

		return response
	}
	return NextResponse.json({ success: false }, { status: 400 })
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
