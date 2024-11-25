import NHLTeamLogo from '../visuals/team-logo'
import { PlayerHeadshot } from '../visuals/headshot'
import { RoundingService } from '@/app/utils/rounding-util'
import { SelectedPlayerDetails } from '../search'
import { playerPosition } from '@/app/utils/position.utl'
import { DateService } from '@/app/utils/date.util'
import { GoalieSeasonTotals, GoalieProfile } from '@/app/lib/nhl-player.types'
import GoalieProjectedWeeklyTotals from '../player/goalie/goalie-projected-weekly-totals'
import GoalieCondensedStatsTable from '../player/goalie/goalie-condensed-stats-table'
import GoalieRecentGameStatTable from '../player/goalie/goalie-recent-game-stats-table'
import GoalieCareerStatsTable from '../player/goalie/goalie-career-stats-table'

export default function CompareGoaliesTable({ player }: { player: SelectedPlayerDetails }) {
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
			<div className="inline-block max-w-full align-middle">
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
						<div className="bg-slate-700 rounded-lg p-3 mb-3 md:mb-0 flex flex-col w-full md:w-full lg:w-auto flex-grow">
							<div className="flex-grow flex items-center justify-center">
								<div className="text-7xl">{player.expectedWeeklyPointTotal.toFixed(2)}</div>
							</div>
							<h3 className="font-medium text-gray-900 text-white flex justify-center">
								Expected Weekly Point Total
							</h3>
						</div>
					</div>

					<div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow mb-6">
						<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">Projected Weekly Statline</h2>
						<GoalieProjectedWeeklyTotals stats={player.weekProjections as GoalieSeasonTotals} />
					</div>

					<h2 className="text-xl font-semibold mb-4 dark:text-white">Upcoming Schedule</h2>
					<div className={`grid gap-6 md:grid-cols-1 mb-6`}>
						{player.games.map((game) => (
							<div key={game.id} className="bg-slate-700 rounded-lg p-3 text-sm">
								<div className="whitespace-nowrap px-3 py-3 flex justify-between">
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
										<div>{game.gameDate}</div>
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
										<h3 className="text-lg">Career vs {game.homeTeam.commonName.default}</h3>
										<div>
											{player.prevStats[game.homeTeam.abbrev] ? (
												<GoalieCondensedStatsTable
													stats={player.prevStats[game.homeTeam.abbrev] as GoalieSeasonTotals}
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
										<h3 className="text-lg">Career vs {game.awayTeam.commonName.default}</h3>
										<div>
											{player.prevStats[game.awayTeam.abbrev] ? (
												<GoalieCondensedStatsTable
													stats={player.prevStats[game.awayTeam.abbrev] as GoalieSeasonTotals}
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
					<div className={`grid gap-6 md:grid-cols-3 mb-6`}>
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
										<GoalieRecentGameStatTable stats={game} />
									</div>
								</div>
							</div>
						))}
					</div>

					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">Career Regular Season Stats</h2>
					<div className="rounded-lg bg-slate-700 mt-4 p-3">
						<div className="flex items-center">
							<GoalieCareerStatsTable player={player.playerProfile as GoalieProfile} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
