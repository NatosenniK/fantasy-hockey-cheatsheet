import { PlayerSearch } from "@/app/lib/nhl-player.types";
import NHLTeamLogo from "../visuals/team-logo";
import CondensedStatsTable from "./condensed-stats-table";
import FullStatsTable from "./full-stats-table";
import { PlayerHeadshot } from "../visuals/headshot";
import ProjectedWeeklyTotals from "./projected-weekly-totals";
import { FetchPlayerStats } from "@/app/utils/fetch-player-stats";
import { roundValue } from "@/app/utils/rounding-util";
import { SelectedPlayerDetails } from "../search";


export default function PlayerStatsTable({player}: {player: SelectedPlayerDetails}) {

    if(!player) {
        return<div>Loading...</div>
    }

    
    Object.keys(player.weekProjections).forEach((key) => {
        const value = player.weekProjections[key as keyof typeof player.weekProjections];
        if (typeof value === 'number') {
            player.weekProjections[key as keyof typeof player.weekProjections] = roundValue(value);
        }
    });
    
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="p-2 md:pt-0">
                    <div className="flex items-stretch mb-6 flex-wrap">
                        <div className="bg-slate-700 rounded-lg p-3 md:mr-3 mb-3 md:mb-0 w-full md:w-full lg:w-auto flex flex-col items-center">
                            <PlayerHeadshot width={150} height={150} imageUrl={player.playerProfile.headshot} />
                            <h2 className="text-lg font-semibold mt-4 text-white">{player.playerProfile.firstName.default} {player.playerProfile.lastName.default}</h2>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 md:mr-3 mb-3 md:mb-0 flex flex-col w-full md:w-full lg:w-auto">
                            <div className="flex-grow flex items-center justify-center">
                                <div className="text-7xl">{player.expectedWeeklyPointTotal.toFixed(2)}</div>
                            </div>
                            <h3 className="font-medium text-gray-900 text-white flex justify-center">Expected Weekly Point Total</h3>
                        </div>

                        <div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow">
                            <h3 className="font-medium text-gray-900 dark:text-white">Career Regular Season Stats</h3>
                            <div className="flex items-center">
                                <FullStatsTable player={player.playerProfile} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Upcoming Schedule</h2>
                    <div className={`grid gap-6 md:grid-cols-1 lg:grid-cols-${player.games.length}`}>
                        {player.games.map((game) => (
                            <div
                            key={game.id}
                            className="bg-slate-700 rounded-lg p-3 text-sm"
                            >
                                <div className="whitespace-nowrap px-3 py-3 flex justify-between">
                                    <div className="flex flex-col">
                                        <NHLTeamLogo imageUrl={game.homeTeam.logo} width={50} height={50} alt={game.homeTeam.commonName.default} className="mb-3" />
                                        <div>{game.homeTeam.commonName.default}</div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center">
                                        <div>at</div>
                                        <div>{game.gameDate}</div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <NHLTeamLogo imageUrl={game.awayTeam.logo} width={50} height={50} alt={game.awayTeam.commonName.default} className="mb-3" />
                                        <div>{game.awayTeam.commonName.default}</div>
                                    </div>
                                </div>
                                {game.homeTeam.abbrev !== player.playerProfile.currentTeamAbbrev &&
                                    <div>
                                        <h3 className="text-lg">Career vs {game.homeTeam.commonName.default}</h3>
                                        <div>
                                            {player.prevStats[game.homeTeam.abbrev] ? (
                                                <CondensedStatsTable stats={player.prevStats[game.homeTeam.abbrev]} />
                                            ) : (
                                                <p>No stats available for {game.homeTeam.commonName.default}.</p>
                                            )}
                                        </div>
                                        {/* <div className="mt-3">Projected fantasy points: {player.prevStats[game.homeTeam.abbrev]}</div> */}
                                    </div>
                                }

                                {game.awayTeam.abbrev !== player.playerProfile.currentTeamAbbrev &&
                                    <div>
                                        <h3 className="text-lg">Career vs {game.awayTeam.commonName.default}</h3>
                                        <div>
                                            {player.prevStats[game.awayTeam.abbrev] ? (
                                                <CondensedStatsTable stats={player.prevStats[game.awayTeam.abbrev]} />
                                            ) : (
                                                <p>No stats available for {game.awayTeam.commonName.default}.</p>
                                            )}
                                        </div>
                                        {/* <div className="mt-3">Projected fantasy points: {expectedWeeklyPointTotal.toFixed(2)}</div> */}
                                    </div>
                                }

                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg bg-slate-700 mt-4 p-3">
                        <h3 className="text-lg pl-4 pt-3">Projected Weekly Statline</h3>
                        <ProjectedWeeklyTotals stats={player.weekProjections} />
                    </div>
                </div>
            </div>
        </div>
    );
}
