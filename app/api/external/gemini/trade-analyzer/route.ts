import { PlayerProfile } from '@/app/lib/api/external/nhl/nhl-player.types'
import { NextResponse } from 'next/server'

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

type PlayerTrade = {
	name: string
	team: string
	position: string
	seasonStats: string
}

export async function POST(request: Request) {
	try {
		// Parse the JSON body from the request
		const body = await request.json()

		// Extract the expected parameters from the request body
		const { alphaTrade, betaTrade } = body

		function parseTrade(trade: Array<PlayerProfile>): Array<PlayerTrade> {
			return trade.map((player) => {
				const { firstName, lastName, teamCommonName, position, featuredStats } = player

				return {
					name: `${firstName.default} ${lastName.default}`,
					team: `${teamCommonName.default}`,
					position,
					seasonStats: JSON.stringify(featuredStats.regularSeason.subSeason),
				}
			})
		}

		// Example usage with alphaTrade and betaTrade
		const formattedAlphaTrade = parseTrade(alphaTrade)
		const formattedBetaTrade = parseTrade(betaTrade)

		const leagueRules = `
            Position Starters Maximums
            Forward (F) 6 N/A
            Center (C) 0 No Limit
            Left Wing (LW) 0 No Limit
            Right Wing (RW) 0 No Limit
            Defense (D) 4 No Limit
            Utility (UTIL) 1 N/A
            Goalie (G) 2 4
            Bench (BE) 7 N/A
            Injured Reserve (IR) 2 N/A
            Games Played Limits (Maximums): Goalie - No Limit, Skaters - No Limit
            Scoring:
            Skaters - Goals (G): 3, Assists (A): 2, Plus/Minus (+/-): 1, Penalty Minutes (PIM): 0.1, Power Play Goals (PPG): 1, Power Play Assists (PPA): 1, Short Handed Goals (SHG): 2, Short Handed Assists (SHA): 1, Shots on Goal (SOG): 0.1, Hits (HIT): 0.1, Blocked Shots (BLK): 0.2, Defensemen Points (DEF): 1.
            Goaltenders - Wins (W): 5, Goals Against (GA): -1, Saves (SV): 0.2, Shutouts (SO): 3, Overtime Losses (OTL): 1.
        `

		// Build the request body for the external Gemini API
		const requestBody = {
			contents: [
				{
					parts: [
						{
							text:
								'Analyze the following fantasy hockey trade and determine which side is preferable. Consider the following league rules and scoring system:\n\n' +
								leagueRules +
								'\n\nThis is a keeper league where high-end experienced players cost more money. Players averaging over a point per game can cost $30+ with a league budget of $200, and top-tier players often exceed $40.\n\n' +
								'Outgoing players: ' +
								formattedAlphaTrade
									.map(
										(player) =>
											`${player.name} (${player.team}, ${player.position}) - stats: ${JSON.stringify(
												player.seasonStats,
											)}`,
									)
									.join('; ') +
								'.\nIncoming players: ' +
								formattedBetaTrade
									.map(
										(player) =>
											`${player.name} (${player.team}, ${player.position}) - stats: ${JSON.stringify(
												player.seasonStats,
											)}`,
									)
									.join('; ') +
								'.\n\nProvide a concise, one-paragraph explanation of your choice, avoiding bold or italic formatting. Focus on readability and include reasoning for your preference.',
						},
					],
				},
			],
		}

		// Call the Gemini API
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`
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
