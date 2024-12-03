import { GoalieSeasonTotals } from '@/app/lib/api/external/nhl/nhl-player.types'
import { RoundingService } from '@/app/utils/rounding-util'

interface GoalieProjectedWeeklyTotalsProps {
	stats: GoalieSeasonTotals
}
export default function GoalieProjectedWeeklyTotals({ stats }: GoalieProjectedWeeklyTotalsProps) {
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
										<div>Wins</div>
										<div>{stats.wins}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Losses</div>
										<div>{stats.losses}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>OT</div>
										<div>{stats.otLosses}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Shutouts</div>
										<div>{stats.shutOuts}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Saves</div>
										<div>{stats.saves}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Save %</div>
										<div>
											{RoundingService.roundToDecimal(
												stats.saves / (stats.saves + stats.goalsAgainst),
												3,
											)}
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div>GA</div>
										<div>{stats.goalsAgainst}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>GAA</div>
										<div>{stats.goalsAgainst / stats.gamesPlayed}</div>
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
									W
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									L
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									OT
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SO
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									Saves
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									Save %
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									GA
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									GAA
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-700 dark:even:bg-slate-800">
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.gamesPlayed}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.wins}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.losses}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.otLosses}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.shutOuts}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.saves}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{RoundingService.roundToDecimal(
										stats.saves / (stats.saves + stats.goalsAgainst),
										3,
									)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{stats.goalsAgainst}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{RoundingService.roundToDecimal(stats.goalsAgainst / stats.gamesPlayed, 3)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
