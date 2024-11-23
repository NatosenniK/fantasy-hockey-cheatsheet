import {
	PlayerInfoFull,
	Games,
	GameLog,
	SeasonTotals,
	PlayerSearchResults,
	NHLSeason,
	PlayerSearch,
	GameLogs,
} from '../lib/nhl-player.types'
import { GameFilteringService } from '../utils/game-filtering.util'

class NHLPlayerAPIPrototype {
	// Fetch Connor McDavid's season stats
	async fetchPlayerStats(playerId: number): Promise<PlayerInfoFull> {
		const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/landing`)
		if (!response.ok) throw new Error('Failed to fetch player stats')
		const data = await response.json()
		return data
	}

	async searchForPlayer(query: string): Promise<PlayerSearchResults> {
		const response = await fetch(
			`https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=20&q=${query}`,
		)
		if (!response.ok) throw new Error('Failed to search')

		const searchObject = await response.json()

		// Extract NHL seasons dynamically from the `seasonTotals` array
		const filteredResults = searchObject.filter(
			(filteredResult: PlayerSearch) => filteredResult.teamAbbrev !== null,
		)
		return filteredResults
	}

	async fetchPlayerMatchupStats(abbrev: string): Promise<Games> {
		// Fetch the team's games for the season
		const scheduleResponse = await fetch(`https://api-web.nhle.com/v1/club-schedule-season/${abbrev}/now`)
		if (!scheduleResponse.ok) throw new Error('Failed to fetch schedule')
		const scheduleData = await scheduleResponse.json()

		const filteredGames = GameFilteringService.filterGamesForWeek(scheduleData.games)

		return filteredGames
	}

	async fetchCareerStatsVsTeams(playerId: number, gameType: number): Promise<{ [teamAbbrev: string]: SeasonTotals }> {
		// Define the list of seasons (you might fetch this dynamically from an API if available)
		const leagueAbbrev = 'NHL'
		const gameTypeId = 2
		const playerStatsUrl = `https://api-web.nhle.com/v1/player/${playerId}/landing`

		// Fetch the player's full stats to determine NHL seasons dynamically
		const playerFullStatsResponse = await fetch(playerStatsUrl)
		if (!playerFullStatsResponse.ok) {
			throw new Error(`Failed to fetch player data for ID ${playerId}`)
		}

		const playerFullStats = await playerFullStatsResponse.json()

		// Extract NHL seasons dynamically from the `seasonTotals` array
		const seasons = playerFullStats.seasonTotals
			.filter((season: NHLSeason) => season.leagueAbbrev === leagueAbbrev && season.gameTypeId === gameTypeId)
			.map((season: NHLSeason) => season.season)

		// Prepare an object to store stats against each team
		const statsByTeam: { [teamAbbrev: string]: SeasonTotals } = {}

		for (const season of seasons) {
			// Fetch the player's game logs for this season
			const response = await fetch(
				`https://api-web.nhle.com/v1/player/${playerId}/game-log/${season}/${gameType}`,
			)
			if (!response.ok) throw new Error(`Failed to fetch player game log for season ${season}`)

			const data = await response.json()
			const gameLogs: GameLog[] = data.gameLog

			const filteredGameLogs = GameFilteringService.excludeGamesFromThisWeek(gameLogs)

			// Aggregate stats for each opponent
			for (const game of filteredGameLogs) {
				const opponentAbbrev = game.opponentAbbrev

				if (!statsByTeam[opponentAbbrev]) {
					statsByTeam[opponentAbbrev] = {
						gamesPlayed: 0,
						goals: 0,
						assists: 0,
						points: 0,
						shots: 0,
						pim: 0,
						plusMinus: 0,
						powerPlayPoints: 0,
						shorthandedGoals: 0,
						shorthandedPoints: 0,
						shorthandedAssists: 0,
					}
				}

				// Update stats for this team
				statsByTeam[opponentAbbrev].gamesPlayed += 1
				statsByTeam[opponentAbbrev].goals += game.goals || 0
				statsByTeam[opponentAbbrev].assists += game.assists || 0
				statsByTeam[opponentAbbrev].points += game.points || 0
				statsByTeam[opponentAbbrev].shots += game.shots || 0
				statsByTeam[opponentAbbrev].pim += game.pim || 0 // Penalty minutes
				statsByTeam[opponentAbbrev].plusMinus += game.plusMinus || 0
				statsByTeam[opponentAbbrev].powerPlayPoints += game.powerPlayPoints || 0
				statsByTeam[opponentAbbrev].shorthandedGoals += game.shorthandedGoals || 0
				statsByTeam[opponentAbbrev].shorthandedPoints += game.shorthandedPoints || 0
			}
		}

		return statsByTeam
	}

	async fetchRecentGames(playerId: number, numGames: number): Promise<GameLogs> {
		const gameType = 2
		const season = '20242025'
		const response = await fetch(`https://api-web.nhle.com/v1/player/${playerId}/game-log/${season}/${gameType}`)
		const data = await response.json()
		const gameLogs: GameLogs = data.gameLog

		const filteredGameLogs = GameFilteringService.excludeGamesFromThisWeek(gameLogs)

		return filteredGameLogs.slice(0, numGames)
	}
}

export const NHLPlayerAPI = new NHLPlayerAPIPrototype()
