import { GameLogs, Games } from '../lib/api/external/nhl/nhl-player.types'
import { DateService } from './date.util'

class GameFilteringPrototype {
	filterGamesForWeek(games: Games): Games {
		const { startDate, endDate } = DateService.getThisWeekRange()

		// Helper to normalize UTC time to Eastern Time
		const normalizeToEastern = (utcDateString: string) => {
			const utcDate = new Date(utcDateString)
			const easternOffsetHours = -5 // Adjust for Eastern Time (Standard Time)
			return new Date(utcDate.getTime() + easternOffsetHours * 60 * 60 * 1000)
		}

		return games.filter((game) => {
			const easternGameDate = normalizeToEastern(game.startTimeUTC)
			return easternGameDate >= startDate && easternGameDate <= endDate
		})
	}

	excludeGamesFromThisWeek(gameLogs: GameLogs): GameLogs {
		const { startDate, endDate } = DateService.getThisWeekRange()

		const filteredGames = gameLogs.filter((gameLog) => {
			const gameUTCDate = new Date(gameLog.gameDate)

			const startDateWithGameTime = new Date(startDate)
			startDateWithGameTime.setUTCHours(
				gameUTCDate.getUTCHours(),
				gameUTCDate.getUTCMinutes(),
				gameUTCDate.getUTCSeconds(),
				gameUTCDate.getUTCMilliseconds(),
			)

			const endDateWithGameTime = new Date(endDate)
			endDateWithGameTime.setUTCHours(
				gameUTCDate.getUTCHours(),
				gameUTCDate.getUTCMinutes(),
				gameUTCDate.getUTCSeconds(),
				gameUTCDate.getUTCMilliseconds(),
			)

			const isOutsideRange = gameUTCDate < startDateWithGameTime

			return isOutsideRange
		})

		return filteredGames
	}
}

export const GameFilteringService = new GameFilteringPrototype()
