import TeamTable from '../ui/teams/team-table'

export default async function Standings() {
	return (
		<div className="">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div className="w-full pt-6">
					<h1 className="text-lg font-semibold mt-4 text-white">NHL Standings</h1>
					<TeamTable />
				</div>
			</main>
		</div>
	)
}
