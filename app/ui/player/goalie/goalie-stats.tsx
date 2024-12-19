import { RoundingService } from '@/app/utils/rounding-util'
import { SelectedPlayerDetails } from '../../search'
import { DateService } from '@/app/utils/date.util'
import { GoalieProfile, GoalieSeasonTotals } from '@/app/lib/api/external/nhl/nhl-player.types'
import GoalieProjectedWeeklyTotals from './goalie-projected-weekly-totals'
import GoalieCareerStatsTable from './goalie-career-stats-table'
import GoalieRecentGameStatTable from './goalie-recent-game-stats-table'

import { GetPlayerStatsAgainstUpcomingOpponents } from '@/app/utils/fetch-player-stats-vs-upcoming-opps'
import { GeminiAPI } from '@/app/lib/api/external/gemini/gemini-ai.api'
import { useEffect, useState } from 'react'

import { PlayerCard } from '../player-card'
import UpcomingGameSchedule from '../upcoming-game-schedule'

export default function FullGoalieProjection({ player }: { player: SelectedPlayerDetails }) {
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
			<div className="inline-block min-w-full align-middle">
				<div className="p-2 md:pt-0">
					<PlayerCard player={player} fantasyOutlook={fantasyOutlook} />

					<div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow mb-6">
						<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">Projected Weekly Statline</h2>
						<GoalieProjectedWeeklyTotals stats={player.weekProjections as GoalieSeasonTotals} />
					</div>

					<UpcomingGameSchedule
						games={player.games}
						prevStats={player.prevStats}
						playerProfile={player.playerProfile}
					/>

					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">Career Regular Season Stats</h2>
					<div className="rounded-lg bg-slate-700 mt-4 p-3 mb-6">
						<div className="flex items-center">
							<GoalieCareerStatsTable player={player.playerProfile as GoalieProfile} />
						</div>
					</div>

					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">
						{player.recentPerformance.length > 10
							? `Season gamelog`
							: `Last ${player.recentPerformance.length} games`}
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
										<GoalieRecentGameStatTable stats={game} />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
