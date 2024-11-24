'use client'

import { useState } from 'react'
import Search, { SelectedPlayerDetails } from '../search'
import PlayerStatsTable from './player-stats'

export default function SearchWithPlayer() {
	const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayerDetails | null>(null)

	const handlePlayerSelection = (player: SelectedPlayerDetails) => {
		setSelectedPlayer(player)
	}

	return (
		<div>
			<Search placeholder="Enter a player name..." onPlayerSelection={handlePlayerSelection} />
			{selectedPlayer && (
				<div className="mt-4">
					<div className="flex justify-between">
						<h2 className="text-lg font-semibold">Player Stats</h2>
					</div>
					{selectedPlayer && <PlayerStatsTable player={selectedPlayer} />}
				</div>
			)}
		</div>
	)
}
