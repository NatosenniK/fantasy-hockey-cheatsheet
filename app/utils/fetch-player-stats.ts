import { GeminiAPI } from '../api/gemeni-ai.api'
import { NHLPlayerAPI } from '../api/nhl-player.api'
import {
	Games,
	PlayerProfile,
	SkaterSeasonTotals,
	GoalieSeasonTotals,
	PrevStats,
	SeasonTotals,
} from '../lib/nhl-player.types'
import { PlayerStatCalcUtil } from './calculate-stats.util'
import { RoundingService } from './rounding-util'

export async function FetchPlayerStats(playerId: number, recentGames: number | null) {
	console.time('fetchPlayerStats')
	const playerProfile: PlayerProfile = await NHLPlayerAPI.fetchPlayerStats(playerId)
	console.timeEnd('fetchPlayerStats')
	console.time('fetchWeekUpcomingGames')
	const upcomingGames = await NHLPlayerAPI.fetchWeekUpcomingGames(playerProfile.currentTeamAbbrev)
	console.timeEnd('fetchWeekUpcomingGames')
	console.time('fetchCareerStatsVsTeams')
	const careerStats = await NHLPlayerAPI.fetchCareerStatsVsTeams(playerId, 2)
	console.timeEnd('fetchCareerStatsVsTeams')
	console.time('fetchRecentGames')
	const recentPerformance = await NHLPlayerAPI.fetchRecentGames(playerId, recentGames || undefined)
	console.timeEnd('fetchRecentGames')

	function getPlayerStatsAgainstUpcomingOpponents(
		upcomingGames: Games,
		prevStats: PrevStats,
		playerProfile: PlayerProfile,
	): { opponent: string; stats: SeasonTotals }[] {
		const playerTeamAbbrev = playerProfile.currentTeamAbbrev
		return upcomingGames
			.map((game) => {
				const opponentAbbrev =
					game.homeTeam.abbrev === playerTeamAbbrev ? game.awayTeam.abbrev : game.homeTeam.abbrev
				return opponentAbbrev && prevStats[opponentAbbrev]
					? { opponent: opponentAbbrev, stats: prevStats[opponentAbbrev] }
					: null
			})
			.filter((gameStats): gameStats is { opponent: string; stats: SeasonTotals } => gameStats !== null)
	}

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

		const statsVsUpcomingOpp = getPlayerStatsAgainstUpcomingOpponents(upcomingGames, prevStats, playerProfile)

		const fantasyOutlook = await GeminiAPI.fetchAiSummary(playerProfile, recentPerformance, statsVsUpcomingOpp)

		return {
			playerProfile,
			games: upcomingGames,
			prevStats,
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
			fantasyOutlook,
		}
	} else {
		const prevStats: { [teamAbbrev: string]: GoalieSeasonTotals } = careerStats.stats
		const calcResult = PlayerStatCalcUtil.calculateGoalie(upcomingGames, prevStats, recentPerformance)

		if (!calcResult) {
			throw new Error('Failed to calculate skater stats')
		}

		const { weekProjections, expectedWeeklyPointTotal } = calcResult

		const statsVsUpcomingOpp = getPlayerStatsAgainstUpcomingOpponents(upcomingGames, prevStats, playerProfile)

		const fantasyOutlook = await GeminiAPI.fetchAiSummary(playerProfile, recentPerformance, statsVsUpcomingOpp)

		return {
			playerProfile,
			games: upcomingGames,
			prevStats,
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
			fantasyOutlook,
		}
	}
}
