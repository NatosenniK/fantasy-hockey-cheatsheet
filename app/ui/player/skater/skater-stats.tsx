import NHLTeamLogo from '../../visuals/team-logo'
import CondensedStatsTable from './condensed-stats-table'
import SkaterCareerStatsTable from './skater-career-stats-table'
import { PlayerHeadshot } from '../../visuals/headshot'
import SkaterProjectedWeeklyTotals from './skater-projected-weekly-totals'
import { RoundingService } from '@/app/utils/rounding-util'
import { SelectedPlayerDetails } from '../../search'
import { playerPosition } from '@/app/utils/position.utl'
import { DateService } from '@/app/utils/date.util'
import RecentGameStatTable from './recent-game-stats.table'
import { Skater, SkaterProfile, SkaterSeasonTotals } from '@/app/lib/nhl-player.types'

export default function FullSkaterProjection({ player }: { player: SelectedPlayerDetails }) {
	if (!player) {
		return <div>Loading...</div>
	}

	Object.keys(player.weekProjections).forEach((key) => {
		const value = player.weekProjections[key as keyof typeof player.weekProjections]
		if (typeof value === 'number') {
			player.weekProjections[key as keyof typeof player.weekProjections] = RoundingService.roundValue(value)
		}
	})

	return (
		<div className="mt-6 flow-root">
			<div className="inline-block min-w-full align-middle">
				<div className="p-2 md:pt-0">
					<div className="flex items-stretch mb-6 flex-wrap">
						<div className="bg-slate-700 rounded-lg p-3 md:mr-3 mb-3 md:mb-0 w-full md:w-full lg:w-auto flex flex-col items-center">
							<PlayerHeadshot width={150} height={150} imageUrl={player.playerProfile.headshot} />
							<h2 className="text-lg font-semibold mt-4 text-white">
								{player.playerProfile.firstName.default} {player.playerProfile.lastName.default}
							</h2>
							<div className="flex items-center">
								<NHLTeamLogo
									imageUrl={player.playerProfile.teamLogo}
									width={30}
									height={30}
									alt={`${player.playerProfile.currentTeamAbbrev}`}
								/>
								<div className="text-md px-3 border-slate-500 border-l border-r ml-3">
									{player.playerProfile.sweaterNumber}
								</div>
								<div className="text-md px-3 border-slate-500">
									{playerPosition(player.playerProfile.position)}
								</div>
							</div>
						</div>
						<div className="bg-slate-700 rounded-lg p-3 md:mr-3 mb-3 md:mb-0 flex flex-col w-full md:w-full lg:w-auto">
							<div className="flex-grow flex items-center justify-center">
								<div className="text-7xl">{player.expectedWeeklyPointTotal.toFixed(2)}</div>
							</div>
							<h3 className="font-medium text-gray-900 text-white flex justify-center">
								Expected Weekly Point Total
							</h3>
						</div>

						<div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow">
							<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">
								Projected Weekly Statline
							</h2>
							<SkaterProjectedWeeklyTotals stats={player.weekProjections as SkaterSeasonTotals} />
						</div>
					</div>

					<h2 className="text-xl font-semibold mb-4 dark:text-white">Upcoming Schedule</h2>
					<div
						className={`grid gap-6 mb-6 md:grid-cols-1 ${
							player.games.length === 4
								? 'lg:grid-cols-4'
								: player.games.length === 3
									? 'lg:grid-cols-3'
									: player.games.length === 2
										? 'lg:grid-cols-2'
										: 'lg:grid-cols-1'
						}`}
					>
						{player.games.map((game) => (
							<div key={game.id} className="bg-slate-700 rounded-lg p-3 text-sm">
								<div className="flex justify-between mb-3">
									<div>Game Date:</div>
									<div>
										{DateService.convertToReadableDateFromUTC(
											game.startTimeUTC,
											game.easternUTCOffset,
										)}
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
								{game.homeTeam.abbrev !== player.playerProfile.currentTeamAbbrev && (
									<div>
										<h3 className="text-lg">
											Career vs {game.homeTeam.commonName.default}{' '}
											{game.homeTeam.commonName.default === 'Utah Hockey Club'
												? '/ Arizona Coyotes'
												: ''}
										</h3>
										<div>
											{game.homeTeam.abbrev === 'UTA' && player.prevStats['ARI'] ? (
												<CondensedStatsTable
													stats={player.prevStats['ARI'] as SkaterSeasonTotals}
												/>
											) : player.prevStats[game.homeTeam.abbrev] ? (
												<CondensedStatsTable
													stats={player.prevStats[game.homeTeam.abbrev] as SkaterSeasonTotals}
												/>
											) : (
												<p>No stats available for {game.homeTeam.commonName.default}.</p>
											)}
										</div>
										{/* <div className="mt-3">Projected fantasy points: {player.prevStats[game.homeTeam.abbrev]}</div> */}
									</div>
								)}

								{game.awayTeam.abbrev !== player.playerProfile.currentTeamAbbrev && (
									<div>
										<h3 className="text-lg">
											Career vs {game.awayTeam.commonName.default}{' '}
											{game.awayTeam.commonName.default === 'Utah Hockey Club'
												? '/ Arizona Coyotes'
												: ''}
										</h3>
										<div>
											{game.awayTeam.abbrev === 'UTA' && player.prevStats['ARI'] ? (
												<CondensedStatsTable
													stats={player.prevStats['ARI'] as SkaterSeasonTotals}
												/>
											) : player.prevStats[game.awayTeam.abbrev] ? (
												<CondensedStatsTable
													stats={player.prevStats[game.awayTeam.abbrev] as SkaterSeasonTotals}
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
					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">
						Last {player.recentPerformance.length} games
					</h2>
					<div className={`grid gap-6 md:grid-cols-5 mb-6`}>
						{player.recentPerformance.map((game) => (
							<div key={game.gameId} className="bg-slate-700 rounded-lg p-3 text-sm">
								<div className="flex justify-between mb-3">
									<div>Game Date:</div>
									<div>{DateService.convertToReadableDate(game.gameDate)}</div>
								</div>
								<div className="whitespace-nowrap px-3 py-3 flex justify-center">
									<div>
										{' '}
										{game.teamAbbrev} {game.homeRoadFlag === 'R' ? 'at' : 'vs.'}{' '}
										{game.opponentAbbrev}
									</div>
								</div>
								<div>
									<div>
										<RecentGameStatTable stats={game} />
									</div>
								</div>
							</div>
						))}
					</div>

					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">Career Regular Season Stats</h2>
					<div className="rounded-lg bg-slate-700 mt-4 p-3">
						<div className="flex items-center">
							<SkaterCareerStatsTable player={player.playerProfile as SkaterProfile} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
