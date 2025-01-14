'use client'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDebouncedCallback } from 'use-debounce'
import { NHLPlayerAPI } from '../lib/api/external/nhl/nhl-player.api'
import { useEffect, useRef, useState } from 'react'
import { PlayerSearch, PlayerSearchResults } from '../lib/api/external/nhl/nhl-player.types'

export default function LineupSearch({
	placeholder,
	onPlayerSelection,
}: {
	placeholder: string
	onPlayerSelection: (playerId: number) => void
}) {
	const [searchResults, setSearchResults] = useState<PlayerSearchResults>([])
	const [showDropdown, setShowDropdown] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

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

	const handleClick = (player: PlayerSearch) => {
		setShowDropdown(false)
		onPlayerSelection(player.playerId)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setShowDropdown(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
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
									handleClick(player)
								}}
							>
								{player.name} - {player.lastTeamAbbrev}
							</div>
						))}
					</div>
				)}
			</div>

			<FontAwesomeIcon
				icon={faSearch}
				className="fa-fw absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 pt-6"
			/>
		</div>
	)
}
