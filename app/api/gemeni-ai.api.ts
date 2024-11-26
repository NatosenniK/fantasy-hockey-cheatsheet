import { GeminiTypes } from '../lib/gemini.types'
import { GameLogs } from '../lib/nhl-player.types'

const API_KEY = 'AIzaSyCQkW4vYq9JI8S_--DQLS41o2QdX3WbqVk'

class GeminiAPIPrototype {
	async fetchAiSummary(playerName: string, gameLogs: GameLogs): Promise<GeminiTypes.Response> {
		console.log('API KEY: ', API_KEY)
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

		const requestBody = {
			contents: [
				{
					parts: [
						{
							text:
								'Analyze the performance of ' +
								playerName +
								' over the last ' +
								gameLogs.length +
								' games based on the following game logs: ' +
								JSON.stringify(gameLogs) +
								'. Provide 1-2 actionable insights tailored for fantasy hockey users a short prompt way .',
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
