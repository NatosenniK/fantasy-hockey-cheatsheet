import { JWTPayload } from 'jose'

export interface User {
	email: string
	name: string
	password: string
	id: number
}

export interface SafeUser {
	id: number
	email: string
	name: string
}

export interface SessionPayload extends JWTPayload {
	user: User
	expires: string
}
