'use client'

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDebouncedCallback } from 'use-debounce'
import { NHLPlayerAPI } from '../../lib/api/external/nhl/nhl-player.api'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { PlayerProfile, PlayerSearch } from '../../lib/api/external/nhl/nhl-player.types'
import { TradeAnalyzer } from '../../lib/actions'
import { searchInitialState, searchReducer } from './search-reducer'

export default function TradeSearch({
	placeholder,
	onPlayerSelection,
}: {
	placeholder: string
	onPlayerSelection: (playerDetails: PlayerProfile | null) => void
}) {
	const dropdownRef = useRef<HTMLDivElement>(null)

	const [state, dispatch] = useReducer(searchReducer, searchInitialState())

	const handleSearch = useDebouncedCallback((term: string) => {
		if (term) {
			NHLPlayerAPI.searchForPlayer(term)
				.then((result) => {
					dispatch({ type: 'SET_SEARCH_RESULTS', payload: result })
				})
				.catch((error) => {
					console.error('Search failed:', error)
				})
		}
	}, 300)

	const handleClick = useCallback(
		async (player: PlayerSearch) => {
			dispatch({ type: 'SET_SEARCH_TERM', payload: player.name })
			dispatch({ type: 'SET_SHOW_DROPDOWN', payload: false })
			dispatch({ type: 'SET_IS_LOADING', payload: true })
			onPlayerSelection(null)
			const playerData = await TradeAnalyzer(player.playerId)
			onPlayerSelection(playerData)
			dispatch({ type: 'SET_IS_LOADING', payload: false })
		},
		[state.selectedDropdownValue, onPlayerSelection],
	)

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			dispatch({ type: 'SET_SHOW_DROPDOWN', payload: false })
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	useEffect(() => {
		if (state.selectedPlayer) {
			handleClick(state.selectedPlayer) // Re-fetch data when dropdown changes
		}
	}, [state.selectedDropdownValue, state.selectedPlayer])

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
								value={state.searchTerm}
								placeholder={placeholder}
								onChange={(e) => {
									dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })
									handleSearch(e.target.value)
								}}
								onFocus={() => dispatch({ type: 'SET_SHOW_DROPDOWN', payload: true })}
							/>
						</div>
						{state.showDropdown && (
							<div className="absolute top-full left-0 w-full border border-gray-200 rounded-md shadow-md z-10 bg-slate-700">
								{state.searchResults.map((player) => (
									<div
										key={player.playerId}
										className="py-2 px-4 hover:bg-gray-800 cursor-pointer"
										onClick={() => {
											dispatch({ type: 'SET_SELECTED_PLAYER', payload: player })
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
			</div>
		</>
	)
}
