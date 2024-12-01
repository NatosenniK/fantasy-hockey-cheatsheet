import {
	Games,
	GameLog,
	PlayerSearchResults,
	NHLSeason,
	PlayerSearch,
	GameLogs,
	PlayerProfile,
	GoalieSeasonTotals,
	SkaterSeasonTotals,
	GoalieProfile,
	SkaterProfile,
} from './nhl-player.types'
import { GameFilteringService } from '../../../../utils/game-filtering.util'

const baseUrl = 'https://api-web.nhle.com/v1'

class NHLPlayerAPIPrototype {
	// Fetch Player's career stats
	async fetchPlayerStats(playerId: number): Promise<PlayerProfile> {
		const response = await fetch(`${baseUrl}/player/${playerId}/landing`)
		if (!response.ok) throw new Error('Failed to fetch player stats')
		const data = await response.json()

		if (data.position === 'G') {
			return data as GoalieProfile
		} else {
			return data as SkaterProfile
		}
	}

	async fetchMultiplePlayerStats(playerIds: number[]): Promise<SkaterProfile[]> {
		const playerEndpoints = playerIds.map((id) => `${baseUrl}/player/${id}/landing`)

		try {
			const responses = await Promise.all(playerEndpoints.map((url) => fetch(url)))
			const playerData = await Promise.all(responses.map((response) => response.json()))
			return playerData
		} catch (error) {
			console.error('Error fetching player data:', error)
			return []
		}
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

	async fetchWeekUpcomingGames(abbrev: string): Promise<Games> {
		// Fetch the team's games for the season
		const scheduleResponse = await fetch(`${baseUrl}/club-schedule-season/${abbrev}/now`)
		if (!scheduleResponse.ok) throw new Error('Failed to fetch schedule')
		const scheduleData = await scheduleResponse.json()

		const filteredGames = GameFilteringService.filterGamesForWeek(scheduleData.games)

		return filteredGames
	}

	async fetchCareerStatsVsTeams(
		playerId: number,
		gameType: number,
	): Promise<
		| { position: 'Skater'; stats: { [teamAbbrev: string]: SkaterSeasonTotals } }
		| { position: 'Goalie'; stats: { [teamAbbrev: string]: GoalieSeasonTotals } }
	> {
		const leagueAbbrev = 'NHL'
		const gameTypeId = 2
		const playerStatsUrl = `${baseUrl}/player/${playerId}/landing`

		// Fetch the player's full stats to determine NHL seasons dynamically
		const playerFullStatsResponse = await fetch(playerStatsUrl)
		if (!playerFullStatsResponse.ok) {
			throw new Error(`Failed to fetch player data for ID ${playerId}`)
		}

		const playerFullStats = await playerFullStatsResponse.json()

		// Determine player position type
		const isGoalie = playerFullStats.position === 'G'

		// Extract NHL seasons from the `seasonTotals` array
		const seasons = playerFullStats.seasonTotals
			.filter((season: NHLSeason) => season.leagueAbbrev === leagueAbbrev && season.gameTypeId === gameTypeId)
			.map((season: NHLSeason) => season.season)

		const statsByTeam: { [teamAbbrev: string]: SkaterSeasonTotals | GoalieSeasonTotals } = {}

		const fetchPromises = seasons.map((season: NHLSeason) =>
			fetch(`${baseUrl}/player/${playerId}/game-log/${season}/${gameType}`).then((response) => {
				if (!response.ok) {
					throw new Error(`Failed to fetch player game log for season ${season}`)
				}
				return response.json()
			}),
		)

		const gameLogData = await Promise.all(fetchPromises)

		gameLogData.forEach((data) => {
			const gameLogs: GameLog[] = data.gameLog
			const filteredGameLogs = GameFilteringService.excludeGamesFromThisWeek(gameLogs)

			for (const game of filteredGameLogs) {
				const opponentAbbrev = game.opponentAbbrev

				if (!statsByTeam[opponentAbbrev]) {
					statsByTeam[opponentAbbrev] = isGoalie
						? {
								gamesPlayed: 0,
								wins: 0,
								losses: 0,
								otLosses: 0,
								shutOuts: 0,
								goalsAgainst: 0,
								saves: 0,
								savePctg: 0,
							}
						: {
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

				if (isGoalie) {
					// Update goalie stats
					const goalieStats = statsByTeam[opponentAbbrev] as GoalieSeasonTotals
					goalieStats.gamesPlayed += 1
					goalieStats.wins += game.decision === 'W' ? 1 : 0
					goalieStats.losses += game.decision === 'L' ? 1 : 0
					goalieStats.otLosses += game.decision === 'O' ? 1 : 0
					goalieStats.shutOuts += game.shutouts ? 1 : 0
					goalieStats.goalsAgainst += game.goalsAgainst || 0
					goalieStats.saves += game.shotsAgainst - game.goalsAgainst || 0

					const totalShots = goalieStats.saves + goalieStats.goalsAgainst
					goalieStats.savePctg = totalShots > 0 ? goalieStats.saves / totalShots : 0
				} else {
					// Update skater stats
					const skaterStats = statsByTeam[opponentAbbrev] as SkaterSeasonTotals
					skaterStats.gamesPlayed += 1
					skaterStats.goals += game.goals || 0
					skaterStats.assists += game.assists || 0
					skaterStats.points += game.points || 0
					skaterStats.shots += game.shots || 0
					skaterStats.pim += game.pim || 0
					skaterStats.plusMinus += game.plusMinus || 0
					skaterStats.powerPlayPoints += game.powerPlayPoints || 0
					skaterStats.shorthandedGoals += game.shorthandedGoals || 0
					skaterStats.shorthandedPoints += game.shorthandedPoints || 0
				}
			}
		})

		return isGoalie
			? {
					position: 'Goalie',
					stats: statsByTeam as { [teamAbbrev: string]: GoalieSeasonTotals },
				}
			: {
					position: 'Skater',
					stats: statsByTeam as { [teamAbbrev: string]: SkaterSeasonTotals },
				}
	}

	async fetchRecentGames(playerId: number, numGames?: number): Promise<GameLogs> {
		const gameType = 2
		const season = '20242025'
		const response = await fetch(`${baseUrl}/player/${playerId}/game-log/${season}/${gameType}`)
		const data = await response.json()
		const gameLogs: GameLogs = data.gameLog

		const filteredGameLogs = GameFilteringService.excludeGamesFromThisWeek(gameLogs)

		if (numGames !== null && numGames !== undefined) {
			return filteredGameLogs.slice(0, numGames)
		}

		return filteredGameLogs
	}
}

export const NHLPlayerAPI = new NHLPlayerAPIPrototype()
