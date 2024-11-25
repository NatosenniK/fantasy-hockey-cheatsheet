import { NHLPlayerAPI } from '../api/nhl-player.api'
import {
	Games,
	PrevStats,
	PlayerProfile,
	FetchCareerStatsResult,
	SkaterSeasonTotals,
	GoalieSeasonTotals,
} from '../lib/nhl-player.types'
import { PlayerStatCalcUtil } from './calculate-stats.util'
import { RoundingService } from './rounding-util'

export async function FetchPlayerStats(playerId: number, recentGames: number | null) {
	const playerProfile: PlayerProfile = await NHLPlayerAPI.fetchPlayerStats(playerId)
	const games: Games = await NHLPlayerAPI.fetchPlayerMatchupStats(playerProfile.currentTeamAbbrev)
	const result = await NHLPlayerAPI.fetchCareerStatsVsTeams(playerId, 2)
	const recentPerformance = await NHLPlayerAPI.fetchRecentGames(playerId, recentGames || undefined)

	if (result.position === 'Skater') {
		const prevStats: { [teamAbbrev: string]: SkaterSeasonTotals } = result.stats
		const { weekProjections, expectedWeeklyPointTotal } = PlayerStatCalcUtil.calculateSkater(
			playerProfile,
			games,
			prevStats,
			recentPerformance,
		)

		return {
			playerProfile,
			games,
			prevStats,
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
		}
	} else {
		const prevStats: { [teamAbbrev: string]: GoalieSeasonTotals } = result.stats
		const { weekProjections, expectedWeeklyPointTotal } = PlayerStatCalcUtil.calculateGoalie(
			games,
			prevStats,
			recentPerformance,
		)

		return {
			playerProfile,
			games,
			prevStats,
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
		}
	}
}
