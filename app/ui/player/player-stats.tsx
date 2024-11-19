// components/McDavidStatsTable.tsx

import { NHLPlayerAPI } from "@/app/api/nhl-player.api";
import { PlayerInfoFull, Games, PrevStats, SeasonTotals } from "@/app/lib/nhl-player.types";
import NHLTeamLogo from "../visuals/team-logo";
import CondensedStatsTable from "./condensed-stats-table";
import FullStatsTable from "./full-stats-table";
import { PlayerHeadshot } from "../visuals/headshot";
import ProjectedWeeklyTotals from "./projected-weekly-totals";
import { FetchPlayerStats } from "@/app/utils/fetch-player-stats";


export default async function PlayerStatsTable() {
    
    const { playerProfile, games, prevStats, expectedWeeklyPointTotal, weekProjections } = await FetchPlayerStats();
    
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg p-2 md:pt-0">
                    <div className="flex items-stretch mb-6 flex-wrap">
                        <div className="bg-slate-700 rounded-lg p-3 md:mr-3 mb-3 md:mb-0 w-full md:w-full lg:w-auto flex flex-col items-center">
                            <PlayerHeadshot width={150} height={150} imageUrl={playerProfile.headshot} />
                            <h2 className="text-lg font-semibold mt-4 text-white">{playerProfile.firstName.default} {playerProfile.lastName.default}</h2>
                        </div>
                        <div className="bg-slate-700 rounded-lg p-3 md:mr-3 mb-3 md:mb-0 flex flex-col w-full md:w-full lg:w-auto">
                            <div className="flex-grow flex items-center justify-center">
                                <div className="text-7xl">{expectedWeeklyPointTotal.toFixed(2)}</div>
                            </div>
                            <h3 className="font-medium text-gray-900 text-white flex justify-center">Expected Weekly Point Total</h3>
                        </div>

                        <div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center w-full md:w-full lg:w-auto">
                            <h3 className="font-medium text-gray-900 dark:text-white">Career Regular Season Stats</h3>
                            <div className="flex items-center">
                                <FullStatsTable player={playerProfile} />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Upcoming Schedule</h2>
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                        {games.map((game) => (
                            <div
                            key={game.id}
                            className="bg-slate-700 rounded-lg p-3 text-sm"
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
                                        {/* <div className="mt-3">Projected fantasy points: {prevStats[game.homeTeam.abbrev]}</div> */}
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
                                        {/* <div className="mt-3">Projected fantasy points: {expectedWeeklyPointTotal.toFixed(2)}</div> */}
                                    </div>
                                }

                            </div>
                        ))}
                    </div>

                    <div className="rounded-lg bg-slate-700 mt-4 p-3">
                        <h3 className="text-lg pl-4 pt-3">Projected Weekly Statline</h3>
                        <ProjectedWeeklyTotals stats={weekProjections} />
                    </div>
                </div>
            </div>
        </div>
    );
}
