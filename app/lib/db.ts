import { neon } from '@neondatabase/serverless'
import { User } from './api/user/user.types'

const sql = neon(`${process.env.DATABASE_URL}`)

export async function getUser(email: string): Promise<User | undefined> {
	try {
		const result = await sql`SELECT * FROM "user" WHERE email=${email}`
		return result[0] as User
	} catch (error) {
		console.error('Failed to fetch user:', error)
		throw new Error('Failed to fetch user.')
	}
}
