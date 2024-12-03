import { SkaterSeasonTotals } from '@/app/lib/api/external/nhl/nhl-player.types'

interface SkaterProjectedWeeklyTotalsProps {
	stats: SkaterSeasonTotals
}
export default function SkaterProjectedWeeklyTotals({ stats }: SkaterProjectedWeeklyTotalsProps) {
	return (
		<div className="mt-3 flow-root overflow-hidden overflow-x-auto">
			<div className="inline-block min-w-full align-middle bg-slate-700 rounded-lg">
				<div className="rounded-lg">
					<div className="md:hidden">
						<div className="mb-2 w-full rounded-md bg-white p-4 dark:bg-slate-600 dark:text-white">
							<div className="flex items-center justify-between">
								<div className="w-full">
									<div className="flex justify-between items-center">
										<div>Games Played</div>
										<div>{stats.gamesPlayed}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Goals</div>
										<div>{stats.goals}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Assists</div>
										<div>{stats.assists}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Points</div>
										<div>{stats.points}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>+/-</div>
										<div>{stats.plusMinus > 0 ? `+${stats.plusMinus}` : stats.plusMinus}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>PIM</div>
										<div>{stats.pim}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>PPP</div>
										<div>{stats.powerPlayPoints}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>SHG</div>
										<div>{stats.shorthandedGoals}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>SHA</div>
										<div>{stats.shorthandedAssists}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Shots</div>
										<div>{stats.shots}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<table className="hidden md:table min-w-full border-collapse border bg-slate-700 border-gray-200 dark:border-slate-700">
						<thead>
							<tr className="bg-slate-800">
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									GP
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									G
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									A
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									P
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									+/-
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									PIM
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									PPP
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SHG
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SHA
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									Shots
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-700 dark:even:bg-slate-800">
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.gamesPlayed}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.goals}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.assists}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.points}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.plusMinus > 0 ? `+${stats.plusMinus}` : stats.plusMinus}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.pim}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.powerPlayPoints}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.shorthandedGoals}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.shorthandedPoints}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.shots}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
