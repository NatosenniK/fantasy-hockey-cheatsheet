import LineupAssistantTable from '../ui/lineup-assistant/lineup-assistant-table'

export default async function LineupAssistant() {
	return (
		<div className="">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div className="w-full pt-6">
					<h1 className="text-lg font-semibold mt-4 text-white">Lineup Assistant</h1>
					<LineupAssistantTable />
				</div>
			</main>
		</div>
	)
}
