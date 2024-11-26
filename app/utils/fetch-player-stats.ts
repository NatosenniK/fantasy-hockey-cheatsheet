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
	const playerProfile: PlayerProfile = await NHLPlayerAPI.fetchPlayerStats(playerId)
	const games: Games = await NHLPlayerAPI.fetchPlayerMatchupStats(playerProfile.currentTeamAbbrev)
	const result = await NHLPlayerAPI.fetchCareerStatsVsTeams(playerId, 2)
	const recentPerformance = await NHLPlayerAPI.fetchRecentGames(playerId, recentGames || undefined)

	function getPlayerStatsAgainstUpcomingOpponents(
		upcomingGames: Games,
		prevStats: PrevStats,
		playerProfile: PlayerProfile,
	): { opponent: string; stats: SeasonTotals }[] {
		const statsAgainstOpponents: { opponent: string; stats: SeasonTotals }[] = []
		const playerTeamAbbrev = playerProfile.currentTeamAbbrev

		upcomingGames.forEach((game) => {
			let opponentAbbrev: string | null = null

			if (game.homeTeam.abbrev === playerTeamAbbrev) {
				opponentAbbrev = game.awayTeam.abbrev // Opponent is the away team
			} else if (game.awayTeam.abbrev === playerTeamAbbrev) {
				opponentAbbrev = game.homeTeam.abbrev // Opponent is the home team
			}

			if (opponentAbbrev && prevStats[opponentAbbrev]) {
				statsAgainstOpponents.push({
					opponent: opponentAbbrev,
					stats: prevStats[opponentAbbrev],
				})
			}
		})

		return statsAgainstOpponents
	}

	if (result.position === 'Skater') {
		const prevStats: { [teamAbbrev: string]: SkaterSeasonTotals } = result.stats
		const { weekProjections, expectedWeeklyPointTotal } = PlayerStatCalcUtil.calculateSkater(
			playerProfile,
			games,
			prevStats,
			recentPerformance,
		)

		const statsVsUpcomingOpp = getPlayerStatsAgainstUpcomingOpponents(games, prevStats, playerProfile)

		const fantasyOutlook = await GeminiAPI.fetchAiSummary(playerProfile, recentPerformance, statsVsUpcomingOpp)

		return {
			playerProfile,
			games,
			prevStats,
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
			fantasyOutlook,
		}
	} else {
		const prevStats: { [teamAbbrev: string]: GoalieSeasonTotals } = result.stats
		const { weekProjections, expectedWeeklyPointTotal } = PlayerStatCalcUtil.calculateGoalie(
			games,
			prevStats,
			recentPerformance,
		)

		const statsVsUpcomingOpp = getPlayerStatsAgainstUpcomingOpponents(games, prevStats, playerProfile)

		const fantasyOutlook = await GeminiAPI.fetchAiSummary(playerProfile, recentPerformance, statsVsUpcomingOpp)

		return {
			playerProfile,
			games,
			prevStats,
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
			fantasyOutlook,
		}
	}
}
