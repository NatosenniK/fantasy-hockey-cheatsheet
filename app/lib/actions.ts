'use server'

import { FetchPlayerStats } from '../utils/fetch-player-stats'

export async function findPlayer(playerId: number, recentGames: number | null) {
	console.log('recent Game: ', recentGames)
	try {
		const { playerProfile, games, prevStats, expectedWeeklyPointTotal, weekProjections, last5Games } =
			await FetchPlayerStats(playerId, recentGames)
		return { playerProfile, games, prevStats, expectedWeeklyPointTotal, weekProjections, last5Games }
	} catch (error) {
		console.error('Error fetching player stats:', error)
		throw new Error('Failed to fetch player stats.')
	}
}
