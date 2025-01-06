'use client'

import { useEffect, useState } from 'react'
import Search from '../search/search'
import CompareGoalies from './compare-goalies'
import CompareSkaters from './compare-skaters'
import { GeminiAPI } from '@/app/lib/api/external/gemini/gemini-ai.api'
import { GetPlayerStatsAgainstUpcomingOpponents } from '@/app/utils/fetch-player-stats-vs-upcoming-opps'
import { PlayerStatsVsUpcoming } from '@/app/lib/api/external/nhl/nhl-player.types'
import { FantasyOutlookSkeleton } from '../visuals/skeletons'
import { Button } from '@headlessui/react'
import { SelectedPlayerDetails } from '@/app/lib/types/custom.types'

export default function SearchCompare() {
	const [firstPlayer, setFirstPlayer] = useState<SelectedPlayerDetails | null>(null)
	const [firstPlayerStatsVsUpcomingOpp, setFirstPlayerStatsVsUpcomingOpp] = useState<PlayerStatsVsUpcoming[] | null>(
		null,
	)
	const [secondPlayer, setSecondPlayer] = useState<SelectedPlayerDetails | null>(null)
	const [secondPlayerStatsVsUpcomingOpp, setSecondPlayerStatsVsUpcomingOpp] = useState<
		PlayerStatsVsUpcoming[] | null
	>(null)
	const [fantasyComparison, setFantasyComparison] = useState<string>('')

	const handleFirstPlayerSelection = (player: SelectedPlayerDetails | null) => {
		setFirstPlayer(player)
	}

	const hanldeSecondPlayerSelection = (player: SelectedPlayerDetails | null) => {
		setSecondPlayer(player)
	}

	async function fetchFantasyOutlook(
		firstPlayer: SelectedPlayerDetails,
		firstPlayerStats: PlayerStatsVsUpcoming[],
		secondPlayer: SelectedPlayerDetails,
		secondPlayerStats: PlayerStatsVsUpcoming[],
	) {
		try {
			const summary = await GeminiAPI.fetchFantasyComparison(
				firstPlayer.playerProfile,
				firstPlayer.recentPerformance,
				firstPlayerStats,
				secondPlayer.playerProfile,
				secondPlayer.recentPerformance,
				secondPlayerStats,
			)
			setFantasyComparison(summary)
		} catch (error) {
			console.error('Error fetching fantasy comparison:', error)
		}
	}

	useEffect(() => {
		if (!firstPlayer) {
			return
		}
		const statsVsUpcomingOpp = GetPlayerStatsAgainstUpcomingOpponents(
			firstPlayer.games,
			firstPlayer.prevStats,
			firstPlayer.playerProfile,
		)
		setFirstPlayerStatsVsUpcomingOpp(statsVsUpcomingOpp)
	}, [firstPlayer])

	useEffect(() => {
		if (!secondPlayer) {
			return
		}
		const statsVsUpcomingOpp = GetPlayerStatsAgainstUpcomingOpponents(
			secondPlayer.games,
			secondPlayer.prevStats,
			secondPlayer.playerProfile,
		)
		setSecondPlayerStatsVsUpcomingOpp(statsVsUpcomingOpp)
	}, [secondPlayer])

	useEffect(() => {
		if (!firstPlayer || !firstPlayerStatsVsUpcomingOpp || !secondPlayer || !secondPlayerStatsVsUpcomingOpp) {
			return
		}

		setFantasyComparison('')
		fetchFantasyOutlook(firstPlayer, firstPlayerStatsVsUpcomingOpp, secondPlayer, secondPlayerStatsVsUpcomingOpp)
	}, [firstPlayer, firstPlayerStatsVsUpcomingOpp, secondPlayer, secondPlayerStatsVsUpcomingOpp])

	function clearSelections() {
		setFantasyComparison('')
		setFirstPlayer(null)
		setSecondPlayer(null)
	}

	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Search
					placeholder="Enter a player name..."
					onPlayerSelection={handleFirstPlayerSelection}
					displayProjectionModifier={true}
					hideLoading={true}
				/>
				<Search
					placeholder="Enter a player name..."
					onPlayerSelection={hanldeSecondPlayerSelection}
					displayProjectionModifier={true}
					hideLoading={true}
				/>
			</div>

			{firstPlayer && secondPlayer && (
				<>
					<div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow mt-6">
						<h2 className="text-xl font-semibold mb-4 dark:text-white">Fantasy Comparison</h2>

						{fantasyComparison === '' ? (
							<FantasyOutlookSkeleton />
						) : (
							<div className="text-white" dangerouslySetInnerHTML={{ __html: fantasyComparison }} />
						)}
					</div>
					<div className="flex justify-center">
						<Button
							type="submit"
							className="mt-4 w-96 rounded-md  bg-slate-800 py-3 hover:bg-slate-600"
							onClick={clearSelections}
						>
							Clear Selections
						</Button>
					</div>
				</>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{firstPlayer && (
					<div className="mt-4">
						<h2 className="text-lg font-semibold">Player Stats</h2>
						{firstPlayer.playerProfile.position === 'G' ? (
							<CompareGoalies
								player={firstPlayer}
								suggestedStart={
									secondPlayer
										? firstPlayer.expectedWeeklyPointTotal > secondPlayer.expectedWeeklyPointTotal
										: false
								}
							/>
						) : (
							<CompareSkaters
								player={firstPlayer}
								suggestedStart={
									secondPlayer
										? firstPlayer.expectedWeeklyPointTotal > secondPlayer.expectedWeeklyPointTotal
										: false
								}
							/>
						)}
					</div>
				)}
				{secondPlayer && (
					<div className="mt-4">
						<h2 className="text-lg font-semibold">Player Stats</h2>
						{secondPlayer.playerProfile.position === 'G' ? (
							<CompareGoalies
								player={secondPlayer}
								suggestedStart={
									firstPlayer
										? secondPlayer.expectedWeeklyPointTotal > firstPlayer.expectedWeeklyPointTotal
										: false
								}
							/>
						) : (
							<CompareSkaters
								player={secondPlayer}
								suggestedStart={
									firstPlayer
										? secondPlayer.expectedWeeklyPointTotal > firstPlayer.expectedWeeklyPointTotal
										: false
								}
							/>
						)}
					</div>
				)}
			</div>
		</>
	)
}
