'use client'

import { useState } from 'react'
import Search, { SelectedPlayerDetails } from '../search'
import ComparePlayersTable from './compare-players'

export default function SearchCompare() {
	const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayerDetails | null>(null)

	const handlePlayerSelection = (player: SelectedPlayerDetails) => {
		setSelectedPlayer(player)
	}

	return (
		<div>
			<Search placeholder="Enter a player name..." onPlayerSelection={handlePlayerSelection} />
			{selectedPlayer && (
				<div className="mt-4">
					<h2 className="text-lg font-semibold">Player Stats</h2>
					{/* Pass the selected player to another component if needed */}
					{selectedPlayer && <ComparePlayersTable player={selectedPlayer} />}
				</div>
			)}
		</div>
	)
}
