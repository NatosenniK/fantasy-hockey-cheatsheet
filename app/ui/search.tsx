'use client'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDebouncedCallback } from 'use-debounce'
import { NHLPlayerAPI } from '../lib/api/external/nhl/nhl-player.api'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
	GameLogs,
	Games,
	PlayerProfile,
	PlayerSearch,
	PlayerSearchResults,
	PrevStats,
	SeasonTotals,
} from '../lib/api/external/nhl/nhl-player.types'
import { findPlayer } from '../lib/actions'
import { DropdownOptionProps } from './visuals/dropdown/dropdown.types'
import Dropdown from './visuals/dropdown/dropdown'
import PlayerStatSkeleton from './visuals/skeletons'

export interface SelectedPlayerDetails {
	playerProfile: PlayerProfile
	games: Games
	prevStats: PrevStats
	expectedWeeklyPointTotal: number
	weekProjections: SeasonTotals
	recentPerformance: GameLogs
}

export default function Search({
	placeholder,
	onPlayerSelection,
	displayProjectionModifier,
	hideLoading,
}: {
	placeholder: string
	onPlayerSelection: (playerDetails: SelectedPlayerDetails | null) => void
	displayProjectionModifier: boolean
	hideLoading?: boolean
}) {
	const [searchResults, setSearchResults] = useState<PlayerSearchResults>([])
	const [showDropdown, setShowDropdown] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const [selectedDropdownValue, setSelectedDropdownValue] = useState<number>(5)
	const [selectedPlayer, setSelectedPlayer] = useState<PlayerSearch | null>()
	const [isLoading, setIsLoading] = useState<boolean>(false)

	function getRecentGameOptions(): DropdownOptionProps<number>[] {
		return [
			{ value: 5, label: 'Last 5 Games' },
			{ value: 10, label: 'Last 10 Games' },
			{ value: 0, label: 'Full Season' },
		]
	}

	const handleSearch = useDebouncedCallback((term: string) => {
		if (term) {
			NHLPlayerAPI.searchForPlayer(term)
				.then((result) => {
					setSearchResults(result)
				})
				.catch((error) => {
					console.error('Search failed:', error)
				})
		}
	}, 300)

	const handleClick = useCallback(
		async (player: PlayerSearch) => {
			setShowDropdown(false)
			setIsLoading(true)
			onPlayerSelection(null)
			const playerData = await findPlayer(player.playerId, selectedDropdownValue, player.lastTeamAbbrev)

			onPlayerSelection(playerData)
			setIsLoading(false)
		},
		[selectedDropdownValue, onPlayerSelection],
	)

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setShowDropdown(false)
		}
	}

	const handleSelect = (newValues: number) => {
		setSelectedDropdownValue(newValues)
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		if (selectedPlayer) {
			handleClick(selectedPlayer) // Re-fetch data when dropdown changes
		}
	}, [selectedDropdownValue, selectedPlayer])

	return (
		<>
			<div>
				<div className="relative flex flex-1 flex-shrink-0" ref={dropdownRef}>
					<label htmlFor="search" className="sr-only">
						Search
					</label>
					<div className="relative flex flex-grow items-end">
						<div className="w-full">
							<div className="mb-1">Player Search</div>
							<input
								className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-slate-700 dark:text-white"
								placeholder={placeholder}
								onChange={(e) => {
									handleSearch(e.target.value)
								}}
								onFocus={() => setShowDropdown(true)}
							/>
						</div>
						{showDropdown && (
							<div className="absolute top-full left-0 w-full border border-gray-200 rounded-md shadow-md z-10 bg-slate-700">
								{searchResults.map((player) => (
									<div
										key={player.playerId}
										className="py-2 px-4 hover:bg-gray-800 cursor-pointer"
										onClick={() => {
											setSelectedPlayer(player)
										}}
									>
										{player.name} - {player.lastTeamAbbrev}
									</div>
								))}
							</div>
						)}
					</div>

					{displayProjectionModifier && (
						<div>
							<div className="mb-1 pl-3">Projection Modifier</div>
							<Dropdown
								options={getRecentGameOptions()}
								label={'Projection Modifier'}
								onSelect={handleSelect}
								value={selectedDropdownValue}
								className="w-40 md:w-48 ml-3"
							/>
						</div>
					)}

					<FontAwesomeIcon
						icon={faSearch}
						className="fa-fw absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 pt-6"
					/>
				</div>
				{isLoading && !hideLoading && (
					<div>
						<PlayerStatSkeleton />
					</div>
				)}
			</div>
		</>
	)
}
