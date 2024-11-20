import { Suspense } from "react";
import PlayerStatsTable from "./ui/player/player-stats";
import PlayerStatSkeleton from "./ui/visuals/skeletons";

export default async function Home() { 

  return (
    <div className="mt-6">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full">
          <Suspense fallback={<PlayerStatSkeleton />}>
            <PlayerStatsTable />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
