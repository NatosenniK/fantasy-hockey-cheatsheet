import { SeasonTotals } from '@/app/lib/api/external/nhl/nhl-player.types'
import { NextResponse } from 'next/server'

// const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

export async function POST(request: Request) {
	try {
		// Parse the JSON body from the request
		const body = await request.json()

		// Extract the expected parameters from the request body
		const {
			playerProfileOne,
			recentPerformanceOne,
			statsVsUpcomingOppOne,
			playerProfileTwo,
			recentPerformanceTwo,
			statsVsUpcomingOppTwo,
		} = body

		// Process statsVsUpcomingOppOne to create a summary
		const statsSummaryOne = statsVsUpcomingOppOne
			.map(
				({ opponent, stats }: { opponent: string; stats: SeasonTotals }) =>
					`${opponent}: ${Object.entries(stats)
						.map(([key, value]) => `${key}: ${value}`)
						.join(', ')}`,
			)
			.join('; ')

		const statsSummaryTwo = statsVsUpcomingOppTwo
			.map(
				({ opponent, stats }: { opponent: string; stats: SeasonTotals }) =>
					`${opponent}: ${Object.entries(stats)
						.map(([key, value]) => `${key}: ${value}`)
						.join(', ')}`,
			)
			.join('; ')

		// Determine player position
		let positionOne
		switch (playerProfileOne.position) {
			case 'L':
				positionOne = 'Left Wing'
				break
			case 'C':
				positionOne = 'Center'
				break
			case 'R':
				positionOne = 'Right Wing'
				break
			case 'D':
				positionOne = 'Defenseman'
				break
			case 'G':
				positionOne = 'Goalie'
				break
			default:
				positionOne = 'Unknown Position'
		}

		let positionTwo
		switch (playerProfileOne.position) {
			case 'L':
				positionTwo = 'Left Wing'
				break
			case 'C':
				positionTwo = 'Center'
				break
			case 'R':
				positionTwo = 'Right Wing'
				break
			case 'D':
				positionTwo = 'Defenseman'
				break
			case 'G':
				positionTwo = 'Goalie'
				break
			default:
				positionTwo = 'Unknown Position'
		}

		// Position-specific insights
		const positionInsights = {
			Goalie: 'Focus on save percentage, goals against average, and recent win-loss record. Highlight strong upcoming matchups or trends in workload (e.g., consecutive starts).',
			Skater: 'Focus on goals, assists, points, and power-play production. Highlight consistent scoring trends or favorable upcoming matchups.',
		}
		const positionSpecificInsightsOne =
			positionOne === 'Goalie' ? positionInsights['Goalie'] : positionInsights['Skater']
		const positionSpecificInsightsTwo =
			positionTwo === 'Goalie' ? positionInsights['Goalie'] : positionInsights['Skater']

		// Build the request body for the external Gemini API
		const requestBody = {
			contents: [
				{
					parts: [
						{
							text:
								'Analyze the fantasy hockey performance of ' +
								playerProfileOne.firstName.default +
								' ' +
								playerProfileOne.lastName.default +
								', a ' +
								positionOne +
								' for the ' +
								playerProfileOne.fullTeamName +
								' over the last ' +
								recentPerformanceOne.length +
								' games. Use the following game logs: ' +
								JSON.stringify(recentPerformanceOne) +
								'. ' +
								positionSpecificInsightsOne +
								' Avoid overly focusing on minor game-to-game variations (do not use the word inconsistent) if the player’s overall production remains strong. Here are their career stats vs their upcoming opponents: ' +
								statsSummaryOne +
								'.  Compare it to the following player ' +
								'Analyze the fantasy hockey performance of ' +
								playerProfileTwo.firstName.default +
								' ' +
								playerProfileTwo.lastName.default +
								', a ' +
								positionTwo +
								' for the ' +
								playerProfileTwo.fullTeamName +
								' over the last ' +
								recentPerformanceTwo.length +
								' games. Use the following game logs: ' +
								JSON.stringify(recentPerformanceTwo) +
								'. ' +
								positionSpecificInsightsTwo +
								' Avoid overly focusing on minor game-to-game variations (do not use the word inconsistent) if the player’s overall production remains strong. Here are their career stats vs their upcoming opponents: ' +
								statsSummaryTwo +
								' Provide 1-2 actionable insights in a concise one paragraph format in less than 80 words on which player would be better to start.',
						},
					],
				},
			],
		}

		// Call the Gemini API
		const url = `https://fantasy-hockey-proxy.mattkinne.workers.dev`
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
