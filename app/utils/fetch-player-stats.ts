import { NHLPlayerAPI } from "../lib/nhl-player.api";
import { PlayerInfoFull, Games, PrevStats, SeasonTotals } from "../lib/nhl-player.types";

export async function FetchPlayerStats() {
    const playerProfile: PlayerInfoFull = await NHLPlayerAPI.fetchPlayerStats();
    const games: Games = await NHLPlayerAPI.fetchPlayerMatchupStats();
    const prevStats: PrevStats = await NHLPlayerAPI.fetchCareerStatsVsTeams(8478402, 2);

    // Fantasy values
    const goalWeight = 3;
    const assistWeight = 2;
    const plusMinusWeight = 1;
    const penaltyMinuteWeight = 0.1;
    const shotsOnGoalWeight = 0.1;

    let expectedWeeklyPointTotal = 0;

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
    };

    if (games && prevStats) {
        games.forEach((game) => {
            const teamStats = prevStats[game.homeTeam.abbrev] || prevStats[game.awayTeam.abbrev];
            if (teamStats) {
                const expGoals = (teamStats.goals / teamStats.gamesPlayed) * goalWeight;
                const expAssists = (teamStats.assists / teamStats.gamesPlayed) * assistWeight;
                const expPlusMinus = (teamStats.plusMinus / teamStats.gamesPlayed) * plusMinusWeight;
                const expPenaltyMinutes = (teamStats.pim / teamStats.gamesPlayed) * penaltyMinuteWeight;
                const expShots = (teamStats.shots / teamStats.gamesPlayed) * shotsOnGoalWeight;
                const expPowerPlayPoints = (teamStats.powerPlayPoints / teamStats.gamesPlayed)
                const expShorthandedGoals = (teamStats.shorthandedGoals / teamStats.gamesPlayed)
                const expShorthandedAssists = ((teamStats.shorthandedPoints - teamStats.shorthandedGoals) / teamStats.gamesPlayed)

                expectedWeeklyPointTotal += expGoals + expAssists + expPlusMinus + expPenaltyMinutes + expShots + expPowerPlayPoints + expShorthandedGoals + expShorthandedAssists;

                // Update weekProjections
                weekProjections.goals += parseFloat((teamStats.goals / teamStats.gamesPlayed).toFixed(2));
                weekProjections.assists += parseFloat((teamStats.assists / teamStats.gamesPlayed).toFixed(2))
                weekProjections.plusMinus += parseFloat((teamStats.plusMinus / teamStats.gamesPlayed).toFixed(2))
                weekProjections.pim += parseFloat((teamStats.pim / teamStats.gamesPlayed).toFixed(2))
                weekProjections.shots += parseFloat((teamStats.shots / teamStats.gamesPlayed).toFixed(2))
                weekProjections.points += parseFloat(((teamStats.goals / teamStats.gamesPlayed) + (teamStats.assists / teamStats.gamesPlayed)).toFixed(2))
                weekProjections.gamesPlayed += 1
                weekProjections.powerPlayPoints += parseFloat((teamStats.powerPlayPoints / teamStats.gamesPlayed).toFixed(2))
                weekProjections.shorthandedGoals += parseFloat((teamStats.shorthandedGoals / teamStats.gamesPlayed).toFixed(2))
                weekProjections.shorthandedAssists += parseFloat((((teamStats.shorthandedPoints - teamStats.shorthandedGoals) / teamStats.gamesPlayed)).toFixed(2))
            }
        })
    }

    return {
        playerProfile,
        games,
        prevStats,
        expectedWeeklyPointTotal: parseFloat(expectedWeeklyPointTotal.toFixed(2)),
        weekProjections,
    };
}