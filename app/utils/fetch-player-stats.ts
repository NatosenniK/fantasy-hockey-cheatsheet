import { NHLPlayerAPI } from '../lib/api/external/nhl/nhl-player.api'
import { SkaterSeasonTotals, GoalieSeasonTotals } from '../lib/api/external/nhl/nhl-player.types'
import { PlayerStatCalcUtil } from './calculate-stats.util'

import { RoundingService } from './rounding-util'

export async function FetchPlayerStats(playerId: number, recentGames: number | null, playerTeamAbbrev: string) {
	const playerProfilePromise = NHLPlayerAPI.fetchPlayerStats(playerId)

	const upcomingGamesPromise = NHLPlayerAPI.fetchWeekUpcomingGames(playerTeamAbbrev)

	const careerStatsPromise = NHLPlayerAPI.fetchCareerStatsVsTeams(playerId, 2)

	const recentPerformancePromise = NHLPlayerAPI.fetchRecentGames(playerId, recentGames || undefined)

	console.time('promise')
	const [playerProfile, upcomingGames, careerStats, recentPerformance] = await Promise.all([
		playerProfilePromise,
		upcomingGamesPromise,
		careerStatsPromise,
		recentPerformancePromise,
	])
	console.timeEnd('promise')

	if (careerStats.position === 'Skater') {
		const prevStats: { [teamAbbrev: string]: SkaterSeasonTotals } = careerStats.stats
		const calcResult = PlayerStatCalcUtil.calculateSkater(
			playerProfile,
			upcomingGames,
			prevStats,
			recentPerformance,
		)

		if (!calcResult) {
			throw new Error('Failed to calculate skater stats')
		}

		const { weekProjections, expectedWeeklyPointTotal } = calcResult

		return {
			playerProfile: playerProfile,
			games: upcomingGames,
			prevStats,
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
		}
	} else {
		const prevStats: { [teamAbbrev: string]: GoalieSeasonTotals } = careerStats.stats
		const calcResult = PlayerStatCalcUtil.calculateGoalie(upcomingGames, prevStats, recentPerformance)

		if (!calcResult) {
			throw new Error('Failed to calculate skater stats')
		}

		const { weekProjections, expectedWeeklyPointTotal } = calcResult

		return {
			playerProfile: playerProfile,
			games: upcomingGames,
			prevStats,
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
		}
	}
}
