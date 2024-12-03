import { Games, PlayerProfile, PrevStats, SeasonTotals } from '../lib/api/external/nhl/nhl-player.types'

export function GetPlayerStatsAgainstUpcomingOpponents(
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
