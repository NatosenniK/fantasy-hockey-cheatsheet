import { HeaderElement } from "./ui/header/header";
import PlayerStatsTable from "./ui/player/player-stats";

export default async function Home() {

  return (
    <div className="mt-6">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <PlayerStatsTable />
        </div>
      </main>
    </div>
  );
}
