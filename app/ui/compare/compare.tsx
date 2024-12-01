'use client'

import { useState } from 'react'
import Search, { SelectedPlayerDetails } from '../search'
import CompareGoaliesTable from './compare-goalies'
import CompareSkatersTable from './compare-skaters'

export default function SearchCompare() {
	const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayerDetails | null>(null)

	const handlePlayerSelection = (player: SelectedPlayerDetails) => {
		setSelectedPlayer(player)
	}

	return (
		<div>
			<Search
				placeholder="Enter a player name..."
				onPlayerSelection={handlePlayerSelection}
				displayProjectionModifier={true}
			/>
			{selectedPlayer && (
				<div className="mt-4">
					<h2 className="text-lg font-semibold">Player Stats</h2>

					{selectedPlayer.playerProfile.position === 'G' ? (
						<CompareGoaliesTable player={selectedPlayer} />
					) : (
						<CompareSkatersTable player={selectedPlayer} />
					)}
				</div>
			)}
		</div>
	)
}
