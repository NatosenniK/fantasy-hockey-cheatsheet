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
