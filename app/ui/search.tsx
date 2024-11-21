'use client';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { NHLPlayerAPI } from '../api/nhl-player.api';
import { useState } from 'react';
import { Games, PlayerInfoFull, PlayerSearch, PlayerSearchResults, PrevStats, SeasonTotals } from '../lib/nhl-player.types';
import { findPlayer } from '../lib/actions';

export interface SelectedPlayerDetails {
    playerProfile: PlayerInfoFull
    games: Games
    prevStats: PrevStats
    expectedWeeklyPointTotal: number
    weekProjections: SeasonTotals
}

export default function Search({ placeholder, onPlayerSelection }: { placeholder: string, onPlayerSelection: (playerDetails: SelectedPlayerDetails) => void }) {
  const searchParams = useSearchParams();
  const  [searchResults, setSearchResults] = useState<PlayerSearchResults>([]); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSearch>()

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching... ${term}`);
 
    if (term) {
 
        NHLPlayerAPI.searchForPlayer(term)
            .then(result => {
                setSearchResults(result)
            })
            .catch(error => {
                console.error('Search failed:', error);
            }); 
    }
  }, 300);

  const handleClick = async (player: PlayerSearch) => {
      setShowDropdown(false);
      const playerData = await findPlayer(player.playerId); // Await the result
      onPlayerSelection(playerData); // Pass player data if needed
      setSelectedPlayer(player);
      console.log(selectedPlayer)
      
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-slate-700 dark:text-white"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
        onFocus={() => setShowDropdown(true)} 
     
      />
      <FontAwesomeIcon icon={faSearch} className="fa-fw absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute top-full left-0 w-full border border-gray-200 rounded-md shadow-md z-10 bg-slate-700"> 
          {searchResults.map((player) => (
            <div 
                key={player.playerId} 
                className="py-2 px-4 hover:bg-gray-800 cursor-pointer" 
                onClick={() => handleClick(player)}
            > 
              {player.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
