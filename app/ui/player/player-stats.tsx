// components/McDavidStatsTable.tsx

import { NHLPlayerAPI } from "@/app/lib/nhl-player.api";
import { PlayerInfoFull, Games, PrevStats, SeasonTotals } from "@/app/lib/nhl-player.types";
import NHLTeamLogo from "../teams/team-logo";
import CondensedStatsTable from "./condensed-stats-table";
import FullStatsTable from "./full-stats-table";
import { PlayerHeadshot } from "./headshot";


export default async function McDavidStatsTable() {
    // Fetch McDavid's stats and matchup data
    const playerProfile: PlayerInfoFull = await NHLPlayerAPI.fetchPlayerStats();
    const games: Games = await NHLPlayerAPI.fetchPlayerMatchupStats()
    const prevStats: PrevStats = await NHLPlayerAPI.fetchCareerStatsVsTeams(8478402, 2)

    // Fantasy values
    const goalWeight = 3
    const assistWeight = 2
    const plusMinusWeight = 1
    const penaltyMinuteWeight = .1
    const shotsOnGoalWeight = .1

    let expectedWeeklyPointTotal = 0

    const weekProjections: SeasonTotals = {
        goals: 0,
        assists: 0,
        plusMinus: 0,
        pim: 0,
        shots: 0,
        points: 0,
        gamesPlayed: 0
    };

    function calculateExpectedFantasyPoints(stats: SeasonTotals): number {
        const expGoals = (stats.goals / stats.gamesPlayed) * goalWeight;
        const expAssists = (stats.assists / stats.gamesPlayed) * assistWeight;
        const expPlusMinus = (stats.plusMinus / stats.gamesPlayed) * plusMinusWeight;
        const expPenaltyMinutes = (stats.pim / stats.gamesPlayed) * penaltyMinuteWeight;
        const expectedShots = (stats.shots / stats.gamesPlayed) * shotsOnGoalWeight;
    
        weekProjections.goals += parseFloat((stats.goals / stats.gamesPlayed).toFixed(2));
        weekProjections.assists += parseFloat((stats.assists / stats.gamesPlayed).toFixed(2));
    
        const gamePlusMinus = stats.plusMinus / stats.gamesPlayed;
        weekProjections.plusMinus = parseFloat((weekProjections.plusMinus + gamePlusMinus).toFixed(2));
    
        weekProjections.pim += parseFloat((stats.pim / stats.gamesPlayed).toFixed(2));
        weekProjections.shots += parseFloat((stats.shots / stats.gamesPlayed).toFixed(2));
        weekProjections.gamesPlayed += 1;
    
        const expectedMatchupPoints = expGoals + expAssists + expPlusMinus + expPenaltyMinutes + expectedShots;
        const roundedExpPoints = parseFloat(expectedMatchupPoints.toFixed(2));
    
        const totalPoints = (stats.goals / stats.gamesPlayed) + (stats.assists / stats.gamesPlayed);
        weekProjections.points += parseFloat(totalPoints.toFixed(2));
    
        expectedWeeklyPointTotal += roundedExpPoints

        return roundedExpPoints;
    }
    

    if (!playerProfile) {
        return <div>No stats data available for Connor McDavid.</div>;
    }
    
    if (!games) {
        return <div>No upcoming games available.</div>;
    }

    if (!prevStats) {
        return <div>No previous stats data available for Connor McDavid.</div>;
    }
    
    console.log(playerProfile)
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0">
                    <div className="bg-slate-700 rounded-lg p-3 mb-3">
                        <h2 className="text-lg font-semibold mb-4 dark:text-white">Connor McDavid Stats</h2>
                        <PlayerHeadshot width={150} height={150} imageUrl={playerProfile.headshot} />
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 dark:text-white">Career Regular Season Stats</h3>
                            <div className="flex items-center space-x-4">
                                <FullStatsTable player={playerProfile} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Upcoming Schedule</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {games.map((game) => (
                            <div
                            key={game.id}
                            className="bg-slate-700 rounded-lg p-3 w-full py-3 text-sm [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                            >
                                <div className="whitespace-nowrap px-3 py-3 flex justify-between">
                                    <div className="flex flex-col">
                                        <NHLTeamLogo imageUrl={game.homeTeam.logo} width={50} height={50} alt={game.homeTeam.commonName.default} className="mb-3" />
                                        <div>{game.homeTeam.commonName.default}</div>
                                    </div>
                                    <div>at</div>
                                    <div className="flex flex-col items-end">
                                        <NHLTeamLogo imageUrl={game.awayTeam.logo} width={50} height={50} alt={game.awayTeam.commonName.default} className="mb-3" />
                                        <div>{game.awayTeam.commonName.default}</div>
                                    </div>
                                </div>
                                {game.homeTeam.abbrev !== "EDM" &&
                                    <div>
                                        <h3 className="text-lg">Career vs {game.homeTeam.commonName.default}</h3>
                                        <div>
                                            {prevStats[game.homeTeam.abbrev] ? (
                                                <CondensedStatsTable stats={prevStats[game.homeTeam.abbrev]} />
                                            ) : (
                                                <p>No stats available for {game.homeTeam.commonName.default}.</p>
                                            )}
                                        </div>
                                        <div className="mt-3">Projected fantasy points: {calculateExpectedFantasyPoints(prevStats[game.homeTeam.abbrev])}</div>
                                    </div>
                                }

                                {game.awayTeam.abbrev !== "EDM" &&
                                    <div>
                                        <h3 className="text-lg">Career vs {game.awayTeam.commonName.default}</h3>
                                        <div>
                                            {prevStats[game.awayTeam.abbrev] ? (
                                                <CondensedStatsTable stats={prevStats[game.awayTeam.abbrev]} />
                                            ) : (
                                                <p>No stats available for {game.awayTeam.commonName.default}.</p>
                                            )}
                                        </div>
                                        <div className="mt-3">Projected fantasy points: {calculateExpectedFantasyPoints(prevStats[game.awayTeam.abbrev])}</div>
                                    </div>
                                }

                            </div>
                        ))}
                    </div>

                    <CondensedStatsTable stats={weekProjections} />

                    <div className="mt-3">Expected weekly points: {expectedWeeklyPointTotal.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}
