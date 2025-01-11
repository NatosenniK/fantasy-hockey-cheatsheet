import { getSession } from '@/app/lib/auth'
import { Lineup } from '@/app/lib/lineup.types'

import { neon } from '@neondatabase/serverless'
import { NHLPlayerAPI } from '../../../lib/api/external/nhl/nhl-player.api'

const sql = neon(`${process.env.DATABASE_URL}`)

export async function GET() {
	const session = await getSession()

	if (!session) {
		return new Response('Unauthorized', { status: 401 }) // Send an HTTP 401 if no session
	}

	const userId = session.user.id

	try {
		const result = (await sql`SELECT * FROM "user_lineup" WHERE user_id=${userId}`) as Lineup[]

		const playerIds = result.map((player) => String(player.player_id)) // Ensure IDs are strings
		const playerStats = await NHLPlayerAPI.fetchMultiplePlayerStats(playerIds)

		const mergedData = playerStats.map((player) => {
			const dbEntry = result.find((entry) => String(entry.player_id) === String(player.playerId))

			return {
				...player,
				isStarting: dbEntry?.is_starting ?? false, // Include `is_starting` value
			}
		})

		return new Response(JSON.stringify(mergedData), { status: 200 }) // Return the result as JSON
	} catch (error) {
		console.error('Failed to fetch lineup:', error)
		return new Response('Failed to fetch lineup.', { status: 500 })
	}
}

export async function POST(request: Request) {
	const session = await getSession()

	if (!session) {
		return new Response('Unauthorized', { status: 401 }) // Send an HTTP 401 if no session
	}

	const userId = session.user.id

	try {
		// Parse the request body to get the player_id
		const { player_id } = await request.json()

		if (!player_id) {
			return new Response('Invalid data: player_id is required.', { status: 400 })
		}

		// Insert the player_id and user_id into the user_lineup table
		await sql`INSERT INTO "user_lineup" (user_id, player_id) VALUES (${userId}, ${player_id})`

		return new Response('Player added to lineup successfully.', { status: 201 })
	} catch (error) {
		console.error('Failed to add player to lineup:', error)
		return new Response('Failed to add player to lineup.', { status: 500 })
	}
}

export async function DELETE(request: Request) {
	const session = await getSession()

	if (!session) {
		return new Response('Unauthorized', { status: 401 }) // Send an HTTP 401 if no session
	}

	const userId = session.user.id

	try {
		// Parse the request body to get the player_id
		const { player_id } = await request.json()

		if (!player_id) {
			return new Response('Invalid data: player_id is required.', { status: 400 })
		}

		console.log('Deleting for userId:', userId, 'player_id:', player_id)

		// Perform the DELETE query and return the number of affected rows
		const result = await sql`
            DELETE FROM "user_lineup"
            WHERE user_id = ${userId} AND player_id = ${player_id}
            RETURNING *;
        `

		// Check if a row was deleted
		if (result.length === 0) {
			return new Response('Player not found in lineup.', { status: 404 })
		}

		return new Response('Player removed from lineup successfully.', { status: 200 })
	} catch (error) {
		console.error('Failed to remove player from lineup:', error)
		return new Response('Failed to remove player from lineup.', { status: 500 })
	}
}
