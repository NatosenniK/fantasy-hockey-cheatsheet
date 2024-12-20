'use client'

import { useState } from 'react'
import Search from '../search/search'
import FullSkaterProjection from './skater/skater-stats'
import FullGoalieProjection from './goalie/goalie-stats'
import { SelectedPlayerDetails } from '@/app/lib/types/custom.types'

export default function SearchWithPlayer() {
	const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayerDetails | null>(null)

	const handlePlayerSelection = (player: SelectedPlayerDetails | null) => {
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
					<div className="flex justify-between">
						<h2 className="text-lg font-semibold">Player Stats</h2>
					</div>
					{selectedPlayer.playerProfile.position === 'G' ? (
						<FullGoalieProjection player={selectedPlayer} />
					) : (
						<FullSkaterProjection player={selectedPlayer} />
					)}
				</div>
			)}
		</div>
	)
}
