import { getUser } from '@/app/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { encrypt } from '@/app/lib/auth'
import { SafeUser } from '@/app/lib/user.types'

export async function POST(request: Request) {
	const { email, password } = await request.json()

	const dbUser = await getUser(email)
	if (!dbUser) {
		return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
	}

	const passwordsMatch = await bcrypt.compare(password, dbUser.password)
	if (!passwordsMatch) {
		return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
	}

	const safeUser: SafeUser = {
		id: dbUser.id,
		email: dbUser.email,
		name: dbUser.name,
	}

	const session = await encrypt({ user: safeUser })

	const response = NextResponse.json({ success: true })
	response.cookies.set('session', session, {
		httpOnly: true,
		maxAge: 3600,
	})

	return response
}
