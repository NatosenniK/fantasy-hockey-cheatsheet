'use server'

import { FetchPlayerStats } from '../utils/fetch-player-stats'

export async function findPlayer(playerId: number, recentGames: number | null) {
	try {
		const {
			playerProfile,
			games,
			prevStats,
			expectedWeeklyPointTotal,
			weekProjections,
			recentPerformance: recentPerformance,
			fantasyOutlook,
		} = await FetchPlayerStats(playerId, recentGames)
		return {
			playerProfile,
			games,
			prevStats,
			expectedWeeklyPointTotal,
			weekProjections,
			recentPerformance,
			fantasyOutlook,
		}
	} catch (error) {
		console.error('Error fetching player stats:', error)
		throw new Error('Failed to fetch player stats.')
	}
}

export const loginUser = async (email: string, password: string) => {
	try {
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})

		if (!response.ok) {
			throw new Error('Login failed')
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error logging in:', error)
		throw error
	}
}

// export async function register(prevState: string | undefined, formData: FormData) {
// 	const name = formData.get('name') as string
// 	const username = formData.get('username') as string
// 	const email = formData.get('email') as string
// 	const password = formData.get('password') as string

// 	if (email && password) {
// 		// Check if user exists
// 		const existingUser = await sql`SELECT * FROM users WHERE email=${email}`
// 		if (existingUser.rowCount > 0) {
// 			return 'User already exists.'
// 		}

// 		// Hash the password
// 		const hashedPassword = await bcrypt.hash(password, 10)

// 		// Insert new user
// 		await sql`
//         INSERT INTO users (name, email, username, password)
//         VALUES (${name}, ${email}, ${username}, ${hashedPassword})
//       `

// 		await signIn('credentials', { email, password })
// 	}
// }
