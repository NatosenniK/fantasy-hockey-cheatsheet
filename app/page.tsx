import TeamTable from "./ui/teams/team-table";
import PlayerStatsTable from "./ui/player/player-stats";



export default async function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <PlayerStatsTable />
        </div>
        <div>
          <h1>NHL Teams</h1>
          <TeamTable />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Fantasy Hockey Cheatsheet
      </footer>
    </div>
  );
}
