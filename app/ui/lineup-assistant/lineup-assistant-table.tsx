'use client'

// import { NHLPlayerAPI } from '@/app/api/nhl-player.api'

import { SkaterProfile } from '@/app/lib/api/external/nhl/nhl-player.types'
import { playerSlot } from '@/app/utils/position.utl'
// import { PlayerProfile } from '@/app/lib/nhl-player.types'
import { useEffect, useState } from 'react'
import { PlayerHeadshot } from '../visuals/headshot'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { TableRowSkeleton } from '../visuals/skeletons'
import LineupSearch from '../lineup-search'

export default function LineupAssistantTable() {
	const [players, setPlayers] = useState<SkaterProfile[] | null>(null)
	const [adding, setAdding] = useState<boolean>(false)

	async function fetchLineup() {
		try {
			const response = await fetch('/api/user/lineup')
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`)
			}
			const data = await response.json()

			// Merge new data with existing state
			setPlayers((prevPlayers) => {
				if (!prevPlayers) return data

				// Create a map of existing players for quick lookup
				const existingPlayerIds = new Set(prevPlayers.map((player) => player.playerId))

				// Add only new players to the existing state
				const newPlayers = data.filter((player: SkaterProfile) => !existingPlayerIds.has(player.playerId))

				return [...prevPlayers, ...newPlayers]
			})
		} catch (error) {
			console.error('Failed to fetch lineup:', error)
		}
	}

	async function addToLineUp(playerId: number) {
		try {
			const response = await fetch('/api/user/lineup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ player_id: playerId }),
			})

			if (response.ok) {
				console.log('Player added successfully!')
				await fetchLineup() // Refresh the lineup to include the new player
				setAdding(false)
			} else {
				console.error('Failed to add player:', await response.text())
			}
		} catch (error) {
			console.error('Error adding player:', error)
		}
	}

	async function removeFromLineup(playerId: number) {
		try {
			const response = await fetch('/api/user/lineup', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ player_id: playerId }),
			})

			if (response.ok) {
				console.log('Player removed successfully!')

				// Update the players state optimistically
				setPlayers((prev) => (prev ? prev.filter((player) => player.playerId !== playerId) : null))
			} else {
				console.error('Failed to delete player:', await response.text())
			}
		} catch (error) {
			console.error('Error removing player:', error)
		}
	}

	const handlePlayerSelection = (playerId: number) => {
		setAdding(true)
		addToLineUp(playerId)
	}

	const handlePlayerRemoval = (playerId: number) => {
		removeFromLineup(playerId)
	}

	useEffect(() => {
		fetchLineup()
	}, [])

	return (
		<div className="mt-6 flow-root w-full">
			<div className="mb-6">
				<LineupSearch onPlayerSelection={handlePlayerSelection} placeholder={'Add players to your lineup...'} />
			</div>

			<div className="inline-block min-w-full align-middle">
				<div className="rounded-lg bg-gray-50 p-2 dark:bg-slate-700">
					<div className="md:hidden">
						{players?.map((player, index) => (
							<div
								key={index}
								className="mb-2 w-full rounded-md bg-white p-4 dark:bg-slate-600 dark:text-white"
							>
								<div className="flex items-center justify-between">
									<div className="mr-4">{index + 1}</div>
									<div className="w-full">
										<div className="flex justify-between items-center">
											<div>
												{player.firstName.default} {player.lastName.default}
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<table className="hidden md:table min-w-full border-collapse border bg-slate-700 border-gray-200 dark:border-slate-700 pt-3">
						<thead>
							<tr className="bg-slate-800">
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									Slot
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									Player
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									GP
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									G
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									A
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									P
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									+/-
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									PIM
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									PPP
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SHG
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SHA
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									Shots
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									Manage
								</th>
							</tr>
						</thead>
						<tbody>
							{players?.map((player, index) => (
								<tr
									key={index}
									className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-700 dark:even:bg-slate-800"
								>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{playerSlot(player.position)}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 flex items-center">
										<PlayerHeadshot
											width={25}
											height={25}
											imageUrl={player.headshot}
											className="mr-3"
										/>{' '}
										<div>
											{player.firstName.default} {player.lastName.default}
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.gamesPlayed}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.goals}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.assists}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.points}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.plusMinus > 0
											? `+${player.featuredStats.regularSeason.subSeason.plusMinus}`
											: player.featuredStats.regularSeason.subSeason.plusMinus}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.pim}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.powerPlayPoints}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.shorthandedGoals}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.shorthandedPoints}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										{player.featuredStats.regularSeason.subSeason.shots}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
										<div onClick={() => handlePlayerRemoval(player.playerId)}>
											<FontAwesomeIcon icon={faTrash} className="fa-fw" />
										</div>
									</td>
								</tr>
							))}
							{adding && <TableRowSkeleton />}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
