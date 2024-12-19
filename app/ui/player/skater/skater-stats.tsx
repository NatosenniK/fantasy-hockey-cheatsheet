'use client'

import SkaterCareerStatsTable from './skater-career-stats-table'

import SkaterProjectedWeeklyTotals from './skater-projected-weekly-totals'
import { RoundingService } from '@/app/utils/rounding-util'
import { SelectedPlayerDetails } from '../../search'

import { DateService } from '@/app/utils/date.util'
import RecentGameStatTable from './recent-game-stats.table'
import { SkaterProfile, SkaterSeasonTotals } from '@/app/lib/api/external/nhl/nhl-player.types'
// import { marked } from 'marked'
import { useEffect, useState } from 'react'
import { GetPlayerStatsAgainstUpcomingOpponents } from '@/app/utils/fetch-player-stats-vs-upcoming-opps'

import { GeminiAPI } from '@/app/lib/api/external/gemini/gemini-ai.api'
import { PlayerCard } from '../player-card'
import UpcomingGameSchedule from '../upcoming-game-schedule'

export default function FullSkaterProjection({ player }: { player: SelectedPlayerDetails }) {
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

					<div className="rounded-lg bg-slate-700 p-3 mb-6 flex flex-col justify-center flex-grow">
						<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">Projected Weekly Statline</h2>
						<SkaterProjectedWeeklyTotals stats={player.weekProjections as SkaterSeasonTotals} />
					</div>

					<UpcomingGameSchedule
						games={player.games}
						prevStats={player.prevStats}
						playerProfile={player.playerProfile}
					/>

					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">Current Season Stats</h2>
					<div className="rounded-lg bg-slate-700 mt-4 p-3 mb-6">
						<div className="flex items-center">
							<SkaterCareerStatsTable player={player.playerProfile as SkaterProfile} />
						</div>
					</div>

					<h2 className="text-xl font-semibold mb-4 dark:text-white mb-3">
						{player.recentPerformance.length > 5
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
										<RecentGameStatTable stats={game} />
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
