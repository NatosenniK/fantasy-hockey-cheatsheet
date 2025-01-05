import { NHLPlayerAPI } from '../lib/api/external/nhl/nhl-player.api'

export async function FetchTradeStats(playerId: number) {
	const playerProfilePromise = NHLPlayerAPI.fetchPlayerStats(playerId)

	const [playerProfile] = await Promise.all([playerProfilePromise])

	return playerProfile
}
