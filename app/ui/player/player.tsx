'use client';

import { PlayerSearch } from "@/app/lib/nhl-player.types";
import { useState } from "react";
import Search, { SelectedPlayerDetails } from "../search";
import PlayerStatsTable from "./player-stats";


export default function SearchWithPlayer() {
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayerDetails | null>(null);

  const handlePlayerSelection = (player: SelectedPlayerDetails) => {
    setSelectedPlayer(player);
  };

  return (
    <div>
      <Search placeholder="Search players..." onPlayerSelection={handlePlayerSelection} />
      {selectedPlayer && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Player Stats</h2>
          {/* Pass the selected player to another component if needed */}
          {selectedPlayer &&
            <PlayerStatsTable player={selectedPlayer} />
          }
          
        </div>
      )}
    </div>
  );
}
