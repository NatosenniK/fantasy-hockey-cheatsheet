import { GameLogs, Games, PlayerProfile, PrevStats, SeasonTotals } from '../api/external/nhl/nhl-player.types'

export interface SelectedPlayerDetails {
	playerProfile: PlayerProfile
	games: Games
	prevStats: PrevStats
	expectedWeeklyPointTotal: number
	weekProjections: SeasonTotals
	recentPerformance: GameLogs
}
