import { Suspense } from "react";
import PlayerStatSkeleton from "./ui/visuals/skeletons";
import SearchWithPlayer from "./ui/player/player";

export default async function Home() { 

  return (
    <div className="mt-6">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full">
          <Suspense fallback={<PlayerStatSkeleton />}>
            <SearchWithPlayer />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
