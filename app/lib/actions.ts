'use server'

import { FetchPlayerStats } from '../utils/fetch-player-stats'
import { FetchTradeStats } from '../utils/fetch-trade-stats'

export async function findPlayer(playerId: number, recentGames: number | null, playerTeamAbbrev: string) {
	try {
		const {
			playerProfile,
			games,
			prevStats,
			expectedWeeklyPointTotal,
			weekProjections,
			recentPerformance: recentPerformance,
		} = await FetchPlayerStats(playerId, recentGames, playerTeamAbbrev)
		return {
			playerProfile,
			games,
			prevStats,
			expectedWeeklyPointTotal,
			weekProjections,
			recentPerformance,
		}
	} catch (error) {
		console.error('Error fetching player stats:', error)
		throw new Error('Failed to fetch player stats.')
	}
}

export async function TradeAnalyzer(playerId: number) {
	try {
		return await FetchTradeStats(playerId)
	} catch (error) {
		console.error('Error fetching player stats:', error)
		throw new Error('Failed to fetch player stats.')
	}
}
