import { PlayerSearch, PlayerSearchResults } from '@/app/lib/api/external/nhl/nhl-player.types'

export type SearchState = {
	searchResults: PlayerSearchResults
	searchTerm: string
	showDropdown: boolean
	selectedDropdownValue: number
	selectedPlayer: PlayerSearch | null
	isLoading: boolean
}

export type SearchAction =
	| { type: 'SET_SEARCH_RESULTS'; payload: PlayerSearchResults }
	| { type: 'SET_SEARCH_TERM'; payload: string }
	| { type: 'SET_SHOW_DROPDOWN'; payload: boolean }
	| { type: 'SET_SELECTED_DROPDOWN_VALUE'; payload: number }
	| { type: 'SET_SELECTED_PLAYER'; payload: PlayerSearch | null }
	| { type: 'SET_IS_LOADING'; payload: boolean }

export function searchReducer(state: SearchState, action: SearchAction): SearchState {
	switch (action.type) {
		case 'SET_SEARCH_RESULTS':
			return { ...state, searchResults: action.payload }
		case 'SET_SEARCH_TERM':
			return { ...state, searchTerm: action.payload }
		case 'SET_SHOW_DROPDOWN':
			return { ...state, showDropdown: action.payload }
		case 'SET_SELECTED_DROPDOWN_VALUE':
			return { ...state, selectedDropdownValue: action.payload }
		case 'SET_SELECTED_PLAYER':
			return { ...state, selectedPlayer: action.payload }
		case 'SET_IS_LOADING':
			return { ...state, isLoading: action.payload }
		default:
			return state
	}
}

export function searchInitialState() {
	const initialState: SearchState = {
		searchResults: [],
		searchTerm: '',
		showDropdown: false,
		selectedDropdownValue: 5,
		selectedPlayer: null,
		isLoading: false,
	}
	return initialState
}
