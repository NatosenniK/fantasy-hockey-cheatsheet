import { GeminiResponse } from '../lib/gemini.types'
import { GameLogs, PlayerProfile, SeasonTotals } from '../lib/nhl-player.types'

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
class GeminiAPIPrototype {
	async fetchAiSummary(
		playerProfile: PlayerProfile,
		gameLogs: GameLogs,
		statsVsUpcomingOpp: { opponent: string; stats: SeasonTotals }[],
	): Promise<GeminiResponse> {
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

		const statsSummary = statsVsUpcomingOpp
			.map(
				({ opponent, stats }) =>
					`${opponent}: ${Object.entries(stats)
						.map(([key, value]) => `${key}: ${value}`)
						.join(', ')}`,
			)
			.join('; ')

		let position
		switch (playerProfile.position) {
			case 'L':
				position = 'Left Wing'
				break
			case 'C':
				position = 'Center'
				break
			case 'R':
				position = 'Right Wing'
				break
			case 'D':
				position = 'Defenseman'
				break
			case 'G':
				position = 'Goalie'
				break
			default:
				// Optionally handle unexpected cases
				position = 'Unknown Position'
		}

		const positionInsights = {
			Goalie: 'Focus on save percentage, goals against average, and recent win-loss record. Highlight strong upcoming matchups or trends in workload (e.g., consecutive starts).',
			Skater: 'Focus on goals, assists, points, and power-play production. Highlight consistent scoring trends or favorable upcoming matchups.',
		}

		const positionSpecificInsights = position === 'Goalie' ? positionInsights['Goalie'] : positionInsights['Skater']

		const requestBody = {
			contents: [
				{
					parts: [
						{
							text:
								'Analyze the fantasy hockey performance of ' +
								playerProfile.firstName.default +
								' ' +
								playerProfile.lastName.default +
								', a ' +
								position +
								' for the ' +
								playerProfile.fullTeamName +
								' over the last ' +
								gameLogs.length +
								' games. Use the following game logs: ' +
								JSON.stringify(gameLogs) +
								'. ' +
								positionSpecificInsights +
								' Avoid overly focusing on minor game-to-game variations if the player’s overall production remains strong. Here are their career stats vs their upcoming opponents: ' +
								statsSummary +
								'. Provide 1-2 actionable insights in a concise one paragraph format in less than 80 words.',
						},
					],
				},
			],
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody), // Send the request body as JSON
			})

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`)
			}

			const responseData = await response.json()
			const aiSummary = responseData.candidates[0]?.content?.parts[0]?.text || 'No content available'
			return aiSummary
		} catch (error) {
			console.error('Error fetching AI summary:', error)
			throw new Error('Failed to fetch AI summary.')
		}
	}
}

export const GeminiAPI = new GeminiAPIPrototype()
