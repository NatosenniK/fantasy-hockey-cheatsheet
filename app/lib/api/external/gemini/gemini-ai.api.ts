import { GameLogs, PlayerProfile, SeasonTotals } from '../nhl/nhl-player.types'

class GeminiAPIPrototype {
	async fetchFantasyOutlook(
		playerProfile: PlayerProfile,
		recentPerformance: GameLogs,
		statsVsUpcomingOpp: { opponent: string; stats: SeasonTotals }[],
	): Promise<string> {
		try {
			const response = await fetch('/api/external/gemini', {
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
}

export const GeminiAPI = new GeminiAPIPrototype()
