import { SeasonTotals } from '@/app/lib/api/external/nhl/nhl-player.types'
import { NextResponse } from 'next/server'

// const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: Request) {
	try {
		// Parse the JSON body from the request
		const body = await request.json()

		// Extract the expected parameters from the request body
		const { playerProfile, recentPerformance, statsVsUpcomingOpp } = body

		// Process statsVsUpcomingOpp to create a summary
		const statsSummary = statsVsUpcomingOpp
			.map(
				({ opponent, stats }: { opponent: string; stats: SeasonTotals }) =>
					`${opponent}: ${Object.entries(stats)
						.map(([key, value]) => `${key}: ${value}`)
						.join(', ')}`,
			)
			.join('; ')

		// Determine player position
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
				position = 'Unknown Position'
		}

		// Position-specific insights
		const positionInsights = {
			Goalie: 'Focus on save percentage, goals against average, and recent win-loss record. Highlight strong upcoming matchups or trends in workload (e.g., consecutive starts).',
			Skater: 'Focus on goals, assists, points, and power-play production. Highlight consistent scoring trends or favorable upcoming matchups.',
		}
		const positionSpecificInsights = position === 'Goalie' ? positionInsights['Goalie'] : positionInsights['Skater']

		// Build the request body for the external Gemini API
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
								recentPerformance.length +
								' games. Use the following game logs: ' +
								JSON.stringify(recentPerformance) +
								'. ' +
								positionSpecificInsights +
								' Avoid overly focusing on minor game-to-game variations (do not use the word inconsistent) if the player’s overall production remains strong. Here are their career stats vs their upcoming opponents: ' +
								statsSummary +
								'. Provide 1-2 actionable insights in a concise one paragraph format in less than 80 words.',
						},
					],
				},
			],
		}

		// Call the Gemini API
		const url = `https://api.kinnesotan.com`
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestBody),
		})

		if (!response.ok) {
			throw new Error(`Gemini API returned status ${response.status}`)
		}

		// Parse and return the Gemini API response
		const responseData = await response.json()
		const aiSummary = responseData.candidates?.[0]?.content?.parts?.[0]?.text || 'No content available'

		return NextResponse.json({ success: true, summary: aiSummary })
	} catch (error) {
		console.error('Error in Gemini API POST route:', error)
		return NextResponse.json({ success: false, error: error }, { status: 500 })
	}
}
