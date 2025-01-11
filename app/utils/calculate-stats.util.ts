import {
	GameLogs,
	Games,
	GoalieSeasonTotals,
	PlayerProfile,
	SeasonTotals,
	SkaterProfile,
	SkaterSeasonTotals,
} from '../lib/api/external/nhl/nhl-player.types'
import { RoundingService } from './rounding-util'

class PlayerStatCalculationUtilityPrototype {
	calculateSkater(
		playerProfile: PlayerProfile,
		games: Games,
		prevStats: { [teamAbbrev: string]: SkaterSeasonTotals },
		recentPerformance: GameLogs,
	) {
		// Fantasy values
		const goalWeight = 3
		const assistWeight = 2
		const plusMinusWeight = 1
		const penaltyMinuteWeight = 0.1
		const shotsOnGoalWeight = 0.1
		// const recentPerformanceWeight = 1.2

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

		const weekProjectionsBasedOnRecent: SeasonTotals = {
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

		const weekProjectionsBasedOnHistory: SeasonTotals = {
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

				const basePoints = expGoals + expAssists + expPlusMinus + expPenaltyMinutes + expShots

				recentPerformanceTotal += basePoints

				weekProjectionsBasedOnRecent.goals += game.goals / gamesPlayed
				weekProjectionsBasedOnRecent.assists += game.assists / gamesPlayed
				weekProjectionsBasedOnRecent.plusMinus += game.plusMinus / gamesPlayed
				weekProjectionsBasedOnRecent.pim += game.pim / gamesPlayed
				weekProjectionsBasedOnRecent.shots += game.shots / gamesPlayed
				weekProjectionsBasedOnRecent.points += (game.goals + game.assists) / gamesPlayed
				weekProjectionsBasedOnRecent.powerPlayPoints += game.powerPlayPoints / gamesPlayed
				weekProjectionsBasedOnRecent.shorthandedGoals += game.shorthandedGoals / gamesPlayed
				weekProjectionsBasedOnRecent.shorthandedAssists +=
					(game.shorthandedPoints - game.shorthandedGoals) / gamesPlayed
			})

			// expectedWeeklyPointTotal += recentPerformanceTotal / gamesPlayed

			recentPerformanceTotal = recentPerformanceTotal / gamesPlayed
		}

		if (games && prevStats) {
			games.forEach((game) => {
				let teamStats = null
				if (playerProfile.currentTeamAbbrev !== 'UTA') {
					teamStats =
						game.homeTeam.abbrev === 'UTA'
							? prevStats['ARI']
							: prevStats[game.homeTeam.abbrev] ||
								(game.awayTeam.abbrev === 'UTA' ? prevStats['ARI'] : prevStats[game.awayTeam.abbrev])
				} else {
					teamStats = prevStats[game.homeTeam.abbrev] || prevStats[game.awayTeam.abbrev]
				}

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
					weekProjectionsBasedOnHistory.goals += teamStats.goals
					weekProjectionsBasedOnHistory.assists += teamStats.assists
					weekProjectionsBasedOnHistory.plusMinus += teamStats.plusMinus
					weekProjectionsBasedOnHistory.pim += teamStats.pim
					weekProjectionsBasedOnHistory.shots += teamStats.shots
					weekProjectionsBasedOnHistory.points += teamStats.goals + teamStats.assists
					weekProjectionsBasedOnHistory.gamesPlayed += teamStats.gamesPlayed
					weekProjectionsBasedOnHistory.powerPlayPoints += teamStats.powerPlayPoints
					weekProjectionsBasedOnHistory.shorthandedGoals += teamStats.shorthandedGoals
					weekProjectionsBasedOnHistory.shorthandedAssists +=
						teamStats.shorthandedPoints - teamStats.shorthandedGoals
				}
			})
		}

		// expectedWeeklyPointTotal = (expectedWeeklyPointTotal / (games.length + 1)) * games.length

		weekProjectionsBasedOnHistory.goals =
			weekProjectionsBasedOnHistory.goals / weekProjectionsBasedOnHistory.gamesPlayed
		weekProjectionsBasedOnHistory.assists =
			weekProjectionsBasedOnHistory.assists / weekProjectionsBasedOnHistory.gamesPlayed
		weekProjectionsBasedOnHistory.plusMinus =
			weekProjectionsBasedOnHistory.plusMinus / weekProjectionsBasedOnHistory.gamesPlayed
		weekProjectionsBasedOnHistory.pim =
			weekProjectionsBasedOnHistory.pim / weekProjectionsBasedOnHistory.gamesPlayed
		weekProjectionsBasedOnHistory.shots =
			weekProjectionsBasedOnHistory.shots / weekProjectionsBasedOnHistory.gamesPlayed
		weekProjectionsBasedOnHistory.points =
			weekProjectionsBasedOnHistory.points / weekProjectionsBasedOnHistory.gamesPlayed
		weekProjectionsBasedOnHistory.powerPlayPoints =
			weekProjectionsBasedOnHistory.powerPlayPoints / weekProjectionsBasedOnHistory.gamesPlayed
		weekProjectionsBasedOnHistory.shorthandedGoals =
			weekProjectionsBasedOnHistory.shorthandedGoals / weekProjectionsBasedOnHistory.gamesPlayed
		weekProjectionsBasedOnHistory.shorthandedAssists =
			weekProjectionsBasedOnHistory.shorthandedAssists / weekProjectionsBasedOnHistory.gamesPlayed

		const recentWeight = 0.7
		const historicalWeight = 0.3

		expectedWeeklyPointTotal =
			((recentPerformanceTotal * recentWeight + expectedPointsPastPerformance * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length

		weekProjections.goals +=
			((weekProjectionsBasedOnRecent.goals * recentWeight +
				weekProjectionsBasedOnHistory.goals * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length
		weekProjections.assists +=
			((weekProjectionsBasedOnRecent.assists * recentWeight +
				weekProjectionsBasedOnHistory.assists * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length
		weekProjections.plusMinus +=
			((weekProjectionsBasedOnRecent.plusMinus * recentWeight +
				weekProjectionsBasedOnHistory.plusMinus * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length
		weekProjections.pim +=
			((weekProjectionsBasedOnRecent.pim * recentWeight + weekProjectionsBasedOnHistory.pim * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length
		weekProjections.shots +=
			((weekProjectionsBasedOnRecent.shots * recentWeight +
				weekProjectionsBasedOnHistory.shots * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length
		weekProjections.points +=
			((weekProjectionsBasedOnRecent.points * recentWeight +
				weekProjectionsBasedOnHistory.points * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length
		weekProjections.gamesPlayed = games.length
		weekProjections.powerPlayPoints +=
			((weekProjectionsBasedOnRecent.powerPlayPoints * recentWeight +
				weekProjectionsBasedOnHistory.powerPlayPoints * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length
		weekProjections.shorthandedGoals +=
			((weekProjectionsBasedOnRecent.shorthandedGoals * recentWeight +
				weekProjectionsBasedOnHistory.shorthandedGoals * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length
		weekProjections.shorthandedAssists +=
			((weekProjectionsBasedOnRecent.shorthandedAssists * recentWeight +
				weekProjectionsBasedOnHistory.shorthandedAssists * historicalWeight) /
				(recentWeight + historicalWeight)) *
			games.length

		return {
			recentPerformance: recentPerformance,
			expectedWeeklyPointTotal: RoundingService.roundToDecimal(expectedWeeklyPointTotal, 2),
			weekProjections,
		}
	}

	calculateGoalie(
		playerProfile: PlayerProfile,
		games: Games,
		prevStats: { [teamAbbrev: string]: GoalieSeasonTotals },
		recentPerformance: GameLogs,
	) {
		// Fantasy values
		const goalieWinWeight = 5
		const goalsAgainstWeight = -1
		const goalieSavesWeight = 0.2
		const goalieShutoutWeight = 3
		const goalieOtLossWeight = 1

		const recentPerformanceWeight = 1.2

		let expectedWeeklyPointTotal = 0
		let expectedPointsPastPerformance = 0
		let recentPerformanceTotal = 0

		const weekProjections: GoalieSeasonTotals = {
			gamesPlayed: 0,
			wins: 0,
			losses: 0,
			otLosses: 0,
			shutOuts: 0,
			goalsAgainst: 0,
			saves: 0,
			savePctg: 0,
		}

		if (recentPerformance) {
			const gamesPlayed = recentPerformance.length
			recentPerformance.forEach((game) => {
				const expWins = game.decision === 'W' ? 1 : 0 * goalieWinWeight
				const expOtLosses = game.decision === 'O' ? 1 : 0 * goalieOtLossWeight
				const expGoalsAgainst = game.goalsAgainst * goalsAgainstWeight
				const expSaves = (game.shotsAgainst - game.goalsAgainst) * goalieSavesWeight
				const expShutouts = game.shutouts * goalieShutoutWeight

				const basePoints =
					(expWins + expOtLosses + expGoalsAgainst + expSaves + expShutouts) * recentPerformanceWeight

				recentPerformanceTotal += basePoints
			})

			expectedWeeklyPointTotal += recentPerformanceTotal / gamesPlayed
		}

		if (games && prevStats) {
			games.forEach((game) => {
				let teamStats = null
				if (playerProfile.currentTeamAbbrev !== 'UTA') {
					teamStats =
						game.homeTeam.abbrev === 'UTA'
							? prevStats['ARI']
							: prevStats[game.homeTeam.abbrev] ||
								(game.awayTeam.abbrev === 'UTA' ? prevStats['ARI'] : prevStats[game.awayTeam.abbrev])
				} else {
					teamStats = prevStats[game.homeTeam.abbrev] || prevStats[game.awayTeam.abbrev]
				}

				if (teamStats) {
					const expWins = (teamStats.wins / teamStats.gamesPlayed) * goalieWinWeight
					const expOtLosses = (teamStats.otLosses / teamStats.gamesPlayed) * goalieOtLossWeight
					const expGoalsAgainst = (teamStats.goalsAgainst / teamStats.gamesPlayed) * goalsAgainstWeight
					const expSaves = (teamStats.saves / teamStats.gamesPlayed) * goalieSavesWeight
					const expShutouts = (teamStats.shutOuts / teamStats.gamesPlayed) * goalieShutoutWeight

					expectedPointsPastPerformance = expWins + expOtLosses + expGoalsAgainst + expSaves + expShutouts
					expectedWeeklyPointTotal += expectedPointsPastPerformance

					weekProjections.gamesPlayed += 1
					weekProjections.wins += teamStats.wins / teamStats.gamesPlayed
					weekProjections.losses += teamStats.losses / teamStats.gamesPlayed
					weekProjections.otLosses += teamStats.otLosses / teamStats.gamesPlayed
					weekProjections.shutOuts += teamStats.shutOuts / teamStats.gamesPlayed
					weekProjections.goalsAgainst += teamStats.goalsAgainst / teamStats.gamesPlayed
					weekProjections.saves += teamStats.saves / teamStats.gamesPlayed
					weekProjections.savePctg += teamStats.savePctg / teamStats.gamesPlayed
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

	calculateSkaterAverage(player: SkaterProfile) {
		const goalWeight = 3
		const assistWeight = 2
		const plusMinusWeight = 1
		const penaltyMinuteWeight = 0.1
		const shotsOnGoalWeight = 0.1
		const shortHandedGoalWeight = 2

		const gamesPlayed = player.featuredStats.regularSeason.subSeason.gamesPlayed

		const expGoals = (player.featuredStats.regularSeason.subSeason.goals * goalWeight) / gamesPlayed
		const expAssists = (player.featuredStats.regularSeason.subSeason.assists * assistWeight) / gamesPlayed
		const expPlusMinus = (player.featuredStats.regularSeason.subSeason.plusMinus * plusMinusWeight) / gamesPlayed
		const expPenaltyMinutes = (player.featuredStats.regularSeason.subSeason.pim * penaltyMinuteWeight) / gamesPlayed
		const expShots = (player.featuredStats.regularSeason.subSeason.shots * shotsOnGoalWeight) / gamesPlayed
		const powerPlayPoints = player.featuredStats.regularSeason.subSeason.powerPlayPoints / gamesPlayed
		const shortHandedPoints =
			(player.featuredStats.regularSeason.subSeason.shorthandedGoals * shortHandedGoalWeight) / gamesPlayed +
			(player.featuredStats.regularSeason.subSeason.shorthandedPoints -
				player.featuredStats.regularSeason.subSeason.shorthandedGoals) /
				gamesPlayed

		let basePoints =
			expGoals + expAssists + expPlusMinus + expPenaltyMinutes + expShots + powerPlayPoints + shortHandedPoints

		if (player.position === 'D') {
			const totalPoints =
				(player.featuredStats.regularSeason.subSeason.goals +
					player.featuredStats.regularSeason.subSeason.assists) /
				player.featuredStats.regularSeason.subSeason.gamesPlayed // Calculate points per game
			basePoints += totalPoints // Add +1 per point
		}

		const averageScoring = RoundingService.roundValue(basePoints)

		return averageScoring
	}
}

export const PlayerStatCalcUtil = new PlayerStatCalculationUtilityPrototype()
