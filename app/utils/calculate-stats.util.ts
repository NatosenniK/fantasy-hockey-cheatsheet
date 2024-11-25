import { GameLogs, Games, PlayerProfile, PrevStats, SeasonTotals } from '../lib/nhl-player.types'
import { RoundingService } from './rounding-util'

class PlayerStatCalculationUtilityPrototype {
	calculateSkater(playerProfile: PlayerProfile, games: Games, prevStats: PrevStats, recentPerformance: GameLogs) {
		// Fantasy values
		const goalWeight = 3
		const assistWeight = 2
		const plusMinusWeight = 1
		const penaltyMinuteWeight = 0.1
		const shotsOnGoalWeight = 0.1
		const recentPerformanceWeight = 1.2

		let expectedWeeklyPointTotal = 0
		let expectedPointsPastPerformance = 0
		let recentPerformanceTotal = 0

		const weekProjections: SeasonTotals = {
			goals: 0,
			assists: 0,
			plusMinus: 0,
			pim: 0,
			shots: 0,
			points: 0,
			gamesPlayed: 0,
			powerPlayPoints: 0,
			shorthandedGoals: 0,
			shorthandedPoints: 0,
			shorthandedAssists: 0,
		}

		if (recentPerformance) {
			const gamesPlayed = recentPerformance.length
			recentPerformance.forEach((game) => {
				const expGoals = game.goals * goalWeight
				const expAssists = game.assists * assistWeight
				const expPlusMinus = game.plusMinus * plusMinusWeight
				const expPenaltyMinutes = game.pim * penaltyMinuteWeight
				const expShots = game.shots * shotsOnGoalWeight

				const basePoints =
					(expGoals + expAssists + expPlusMinus + expPenaltyMinutes + expShots) * recentPerformanceWeight

				recentPerformanceTotal += basePoints

				weekProjections.goals += game.goals / gamesPlayed
				weekProjections.assists += game.assists / gamesPlayed
				weekProjections.plusMinus += game.plusMinus / gamesPlayed
				weekProjections.pim += game.pim / gamesPlayed
				weekProjections.shots += game.shots / gamesPlayed
				weekProjections.points += (game.goals + game.assists) / gamesPlayed
				weekProjections.powerPlayPoints += game.powerPlayPoints / gamesPlayed
				weekProjections.shorthandedGoals += game.shorthandedGoals / gamesPlayed
				weekProjections.shorthandedAssists += (game.shorthandedPoints - game.shorthandedGoals) / gamesPlayed
			})

			expectedWeeklyPointTotal += recentPerformanceTotal / gamesPlayed
		}

		if (games && prevStats) {
			console.log(games)
			games.forEach((game) => {
				const teamStats =
					game.homeTeam.abbrev === 'UTA'
						? prevStats['ARI']
						: prevStats[game.homeTeam.abbrev] ||
							(game.awayTeam.abbrev === 'UTA' ? prevStats['ARI'] : prevStats[game.awayTeam.abbrev])

				if (teamStats) {
					const expGoals = (teamStats.goals / teamStats.gamesPlayed) * goalWeight
					const expAssists = (teamStats.assists / teamStats.gamesPlayed) * assistWeight
					const expPlusMinus = (teamStats.plusMinus / teamStats.gamesPlayed) * plusMinusWeight
					const expPenaltyMinutes = (teamStats.pim / teamStats.gamesPlayed) * penaltyMinuteWeight
					const expShots = (teamStats.shots / teamStats.gamesPlayed) * shotsOnGoalWeight
					const expPowerPlayPoints = teamStats.powerPlayPoints / teamStats.gamesPlayed
					const expShorthandedGoals = teamStats.shorthandedGoals / teamStats.gamesPlayed
					const expShorthandedAssists =
						(teamStats.shorthandedPoints - teamStats.shorthandedGoals) / teamStats.gamesPlayed

					let basePoints = expGoals + expAssists + expPlusMinus + expPenaltyMinutes + expShots

					if (playerProfile.position === 'D') {
						const totalPoints = (teamStats.goals + teamStats.assists) / teamStats.gamesPlayed // Calculate points per game
						basePoints += totalPoints // Add +1 per point
					}

					expectedPointsPastPerformance =
						basePoints + expPowerPlayPoints + expShorthandedGoals + expShorthandedAssists
					expectedWeeklyPointTotal += expectedPointsPastPerformance

					// Update weekProjections
					weekProjections.goals += teamStats.goals / teamStats.gamesPlayed
					weekProjections.assists += teamStats.assists / teamStats.gamesPlayed
					weekProjections.plusMinus += teamStats.plusMinus / teamStats.gamesPlayed
					weekProjections.pim += teamStats.pim / teamStats.gamesPlayed
					weekProjections.shots += teamStats.shots / teamStats.gamesPlayed
					weekProjections.points += (teamStats.goals + teamStats.assists) / teamStats.gamesPlayed
					weekProjections.gamesPlayed += 1
					weekProjections.powerPlayPoints += teamStats.powerPlayPoints / teamStats.gamesPlayed
					weekProjections.shorthandedGoals += teamStats.shorthandedGoals / teamStats.gamesPlayed
					weekProjections.shorthandedAssists +=
						(teamStats.shorthandedPoints - teamStats.shorthandedGoals) / teamStats.gamesPlayed
				}
			})
		}

		expectedWeeklyPointTotal = (expectedWeeklyPointTotal / (games.length + 1)) * games.length

		return {
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
		}
	}

	// calculateGoalie(playerProfile: PlayerProfile, games: Games, prevStats: PrevStats, recentPerformance: GameLogs) {
	// 	// Fantasy values
	// 	const goalieWin = 5
	// 	const goalsAgainst = -1
	// 	const goalieSaves = 0.2
	// 	const goalieShutout = 3
	// 	const goalieOtLoss = 1

	// 	let expectedWeeklyPointTotal = 0
	// 	let expectedPointsPastPerformance = 0
	// 	let recentPerformanceTotal = 0

	// 	const weekProjections: GoalieSeasonTotals = {
	// 		goalsAgainst: 0,
	// 		shotsAgainst: 0,
	// 		wins: 0,
	// 		shutouts: 0,
	// 		otLosses: 0,
	// 	}

	// 	if (recentPerformance) {
	// 		const gamesPlayed = recentPerformance.length
	// 		recentPerformance.forEach((game) => {
	// 			const expGoalieWins = game.goals * goalWeight
	// 			const expAssists = game.assists * assistWeight
	// 			const expPlusMinus = game.plusMinus * plusMinusWeight
	// 			const expPenaltyMinutes = game.pim * penaltyMinuteWeight
	// 			const expShots = game.shots * shotsOnGoalWeight

	// 			const basePoints =
	// 				(expGoals + expAssists + expPlusMinus + expPenaltyMinutes + expShots) * recentPerformanceWeight

	// 			recentPerformanceTotal += basePoints

	// 			weekProjections.goals += game.goals / gamesPlayed
	// 			weekProjections.assists += game.assists / gamesPlayed
	// 			weekProjections.plusMinus += game.plusMinus / gamesPlayed
	// 			weekProjections.pim += game.pim / gamesPlayed
	// 			weekProjections.shots += game.shots / gamesPlayed
	// 			weekProjections.points += (game.goals + game.assists) / gamesPlayed
	// 			weekProjections.powerPlayPoints += game.powerPlayPoints / gamesPlayed
	// 			weekProjections.shorthandedGoals += game.shorthandedGoals / gamesPlayed
	// 			weekProjections.shorthandedAssists += (game.shorthandedPoints - game.shorthandedGoals) / gamesPlayed
	// 		})

	// 		expectedWeeklyPointTotal += recentPerformanceTotal / gamesPlayed
	// 	}

	// 	if (games && prevStats) {
	// 		games.forEach((game) => {
	// 			const teamStats =
	// 				game.homeTeam.abbrev === 'UTA'
	// 					? prevStats['ARI']
	// 					: prevStats[game.homeTeam.abbrev] ||
	// 						(game.awayTeam.abbrev === 'UTA' ? prevStats['ARI'] : prevStats[game.awayTeam.abbrev])

	// 			if (teamStats) {
	// 				const expGoalieWins = (teamStats.wins / teamStats.gamesPlayed) * goalieWin
	// 				const expGoalsAgainst = (teamStats.goalsAgainst / teamStats.gamesPlayed) * goalsAgainst
	// 				const expGoalieSaves =
	// 					((teamStats.shotsAgainst - teamStats.goalsAgainst) / teamStats.gamesPlayed) * goalieSaves
	// 				const expGoalieShutouts = (teamStats.shutouts / teamStats.gamesPlayed) * goalieShutout
	// 				const expGoalieOtLosses = (teamStats.otLosses / teamStats.gamesPlayed) * goalieOtLoss

	// 				expectedPointsPastPerformance =
	// 					expGoalieWins + expGoalsAgainst + expGoalieSaves + expGoalieShutouts + expGoalieOtLosses

	// 				// Update weekProjections
	// 				weekProjections.goals += teamStats.goals / teamStats.gamesPlayed
	// 				weekProjections.assists += teamStats.assists / teamStats.gamesPlayed
	// 				weekProjections.plusMinus += teamStats.plusMinus / teamStats.gamesPlayed
	// 				weekProjections.pim += teamStats.pim / teamStats.gamesPlayed
	// 				weekProjections.shots += teamStats.shots / teamStats.gamesPlayed
	// 				weekProjections.points += (teamStats.goals + teamStats.assists) / teamStats.gamesPlayed
	// 				weekProjections.gamesPlayed += 1
	// 				weekProjections.powerPlayPoints += teamStats.powerPlayPoints / teamStats.gamesPlayed
	// 				weekProjections.shorthandedGoals += teamStats.shorthandedGoals / teamStats.gamesPlayed
	// 				weekProjections.shorthandedAssists +=
	// 					(teamStats.shorthandedPoints - teamStats.shorthandedGoals) / teamStats.gamesPlayed
	// 			}
	// 		})
	// 	}

	// 	expectedWeeklyPointTotal = (expectedWeeklyPointTotal / 4) * 3

	// 	return {
	// 		recentPerformance: recentPerformance,
	// 		expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
	// 		weekProjections,
	// 	}
	// }
}

export const PlayerStatCalcUtil = new PlayerStatCalculationUtilityPrototype()
