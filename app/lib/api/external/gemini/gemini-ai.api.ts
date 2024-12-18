import { GameLogs, PlayerProfile, PlayerStatsVsUpcoming, SeasonTotals } from '../nhl/nhl-player.types'

class GeminiAPIPrototype {
	async fetchFantasyOutlook(
		playerProfile: PlayerProfile,
		recentPerformance: GameLogs,
		statsVsUpcomingOpp: { opponent: string; stats: SeasonTotals }[],
	): Promise<string> {
		try {
			const response = await fetch('/api/external/gemini/fantasy-outlook', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					playerProfile,
					recentPerformance,
					statsVsUpcomingOpp,
				}),
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return data.summary
		} catch (error) {
			console.error('Failed to fetch fantasy outlook:', error)
			throw error
		}
	}

	async fetchFantasyComparison(
		playerProfileOne: PlayerProfile,
		recentPerformanceOne: GameLogs,
		statsVsUpcomingOppOne: PlayerStatsVsUpcoming[],
		playerProfileTwo: PlayerProfile,
		recentPerformanceTwo: GameLogs,
		statsVsUpcomingOppTwo: PlayerStatsVsUpcoming[],
	): Promise<string> {
		try {
			const response = await fetch('/api/external/gemini/fantasy-comparison', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					playerProfileOne,
					recentPerformanceOne,
					statsVsUpcomingOppOne,
					playerProfileTwo,
					recentPerformanceTwo,
					statsVsUpcomingOppTwo,
				}),
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return data.summary
		} catch (error) {
			console.error('Failed to fetch fantasy outlook:', error)
			throw error
		}
	}
}

export const GeminiAPI = new GeminiAPIPrototype()
