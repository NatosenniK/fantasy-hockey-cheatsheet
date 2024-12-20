import NHLTeamLogo from '../visuals/team-logo'
import { RoundingService } from '@/app/utils/rounding-util'
import SkaterCareerStatsTable from '../player/skater/skater-career-stats-table'
import CondensedStatsTable from '../player/skater/condensed-stats-table'
import SkaterProjectedWeeklyTotals from '../player/skater/skater-projected-weekly-totals'
import { DateService } from '@/app/utils/date.util'
import RecentGameStatTable from '../player/skater/recent-game-stats.table'
import { SkaterProfile, SkaterSeasonTotals } from '@/app/lib/api/external/nhl/nhl-player.types'
import { useEffect, useState } from 'react'
import { GetPlayerStatsAgainstUpcomingOpponents } from '@/app/utils/fetch-player-stats-vs-upcoming-opps'
import { GeminiAPI } from '@/app/lib/api/external/gemini/gemini-ai.api'
import { PlayerCard } from '../player/player-card'
import { SelectedPlayerDetails } from '@/app/lib/types/custom.types'

export default function CompareSkaters({
	player,
	suggestedStart,
}: {
	player: SelectedPlayerDetails
	suggestedStart?: boolean
}) {
	const [fantasyOutlook, setFantasyOutlook] = useState<string>('')

	useEffect(() => {
		setFantasyOutlook('')
		fetchFantasyOutlook()
	}, [player.playerProfile])

	if (!player) {
		return <div>Loading...</div>
	}

	Object.keys(player.weekProjections).forEach((key) => {
		const value = player.weekProjections[key as keyof typeof player.weekProjections]
		if (typeof value === 'number') {
			player.weekProjections[key as keyof typeof player.weekProjections] = RoundingService.roundValue(value)
		}
	})

	const statsVsUpcomingOpp = GetPlayerStatsAgainstUpcomingOpponents(
		player.games,
		player.prevStats,
		player.playerProfile,
	)

	async function fetchFantasyOutlook() {
		try {
			const summary = await GeminiAPI.fetchFantasyOutlook(
				player.playerProfile,
				player.recentPerformance,
				statsVsUpcomingOpp,
			)
			setFantasyOutlook(summary)
		} catch (error) {
			console.error('Error fetching fantasy outlook:', error)
		}
	}

	return (
		<div className="mt-6 flow-root">
			<div className="inline-block max-w-full align-middle">
				<div className="p-2 md:pt-0">
					<PlayerCard
						player={player}
						fantasyOutlook={fantasyOutlook}
						compare={true}
						suggestedStart={suggestedStart}
					/>

					<div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow mb-6">
						<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">Projected Weekly Statline</h2>
						<SkaterProjectedWeeklyTotals stats={player.weekProjections as SkaterSeasonTotals} />
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
										<h3 className="text-lg">Career vs {game.awayTeam.commonName.default}</h3>
										<div>
											{player.prevStats[game.awayTeam.abbrev] ? (
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
