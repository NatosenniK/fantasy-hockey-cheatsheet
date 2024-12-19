import { DateService } from '@/app/utils/date.util'
import React from 'react'

import { Games, PlayerProfile, PrevStats, SkaterSeasonTotals } from '@/app/lib/api/external/nhl/nhl-player.types'
import NHLTeamLogo from '../visuals/team-logo'
import CondensedStatsTable from './skater/condensed-stats-table'

function UpcomingGameSchedule({
	games,
	prevStats,
	playerProfile,
}: {
	games: Games
	prevStats: PrevStats
	playerProfile: PlayerProfile
}) {
	return (
		<>
			<h2 className="text-xl font-semibold mb-4 dark:text-white">Upcoming Schedule</h2>
			<div
				className={`grid gap-6 mb-6 md:grid-cols-1 ${
					games.length === 4
						? 'lg:grid-cols-4'
						: games.length === 3
							? 'lg:grid-cols-3'
							: games.length === 2
								? 'lg:grid-cols-2'
								: 'lg:grid-cols-1'
				}`}
			>
				{games.map((game) => (
					<div key={game.id} className="bg-slate-700 rounded-lg p-3 text-sm">
						<div className="flex justify-between mb-3">
							<div>Game Date:</div>
							<div>
								{DateService.convertToReadableDateFromUTC(game.startTimeUTC, game.easternUTCOffset)}
							</div>
						</div>
						<div className="whitespace-nowrap px-3 py-3 mb-3 flex justify-between">
							<div className="flex flex-col">
								<NHLTeamLogo
									imageUrl={game.homeTeam.logo}
									width={50}
									height={50}
									alt={game.homeTeam.commonName.default}
									className="mb-3"
								/>
								<div>{game.homeTeam.commonName.default}</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<div>at</div>
							</div>
							<div className="flex flex-col items-end">
								<NHLTeamLogo
									imageUrl={game.awayTeam.logo}
									width={50}
									height={50}
									alt={game.awayTeam.commonName.default}
									className="mb-3"
								/>
								<div>{game.awayTeam.commonName.default}</div>
							</div>
						</div>
						{game.homeTeam.abbrev !== playerProfile.currentTeamAbbrev && (
							<div>
								<h3 className="text-lg">
									Career vs {game.homeTeam.commonName.default}{' '}
									{game.homeTeam.commonName.default === 'Utah Hockey Club' ? '/ Arizona Coyotes' : ''}
								</h3>
								<div>
									{game.homeTeam.abbrev === 'UTA' && prevStats['ARI'] ? (
										<CondensedStatsTable stats={prevStats['ARI'] as SkaterSeasonTotals} />
									) : prevStats[game.homeTeam.abbrev] ? (
										<CondensedStatsTable
											stats={prevStats[game.homeTeam.abbrev] as SkaterSeasonTotals}
										/>
									) : (
										<p>No stats available for {game.homeTeam.commonName.default}.</p>
									)}
								</div>
								{/* <div className="mt-3">Projected fantasy points: {prevStats[game.homeTeam.abbrev]}</div> */}
							</div>
						)}

						{game.awayTeam.abbrev !== playerProfile.currentTeamAbbrev && (
							<div>
								<h3 className="text-lg">
									Career vs {game.awayTeam.commonName.default}{' '}
									{game.awayTeam.commonName.default === 'Utah Hockey Club' ? '/ Arizona Coyotes' : ''}
								</h3>
								<div>
									{game.awayTeam.abbrev === 'UTA' && prevStats['ARI'] ? (
										<CondensedStatsTable stats={prevStats['ARI'] as SkaterSeasonTotals} />
									) : prevStats[game.awayTeam.abbrev] ? (
										<CondensedStatsTable
											stats={prevStats[game.awayTeam.abbrev] as SkaterSeasonTotals}
										/>
									) : (
										<p>No stats available for {game.awayTeam.commonName.default}.</p>
									)}
								</div>
								{/* <div className="mt-3">Projected fantasy points: {expectedWeeklyPointTotal.toFixed(2)}</div> */}
							</div>
						)}
					</div>
				))}
			</div>
		</>
	)
}

export default React.memo(UpcomingGameSchedule)
