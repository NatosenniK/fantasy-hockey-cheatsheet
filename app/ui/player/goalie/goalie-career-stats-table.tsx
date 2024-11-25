import { GoalieProfile, GoalieSeasonTotals, Skater } from '@/app/lib/nhl-player.types'
import { RoundingService } from '@/app/utils/rounding-util'

interface GoalieCareerStatsTableProps {
	player: GoalieProfile
}
export default function GoalieCareerStatsTable({ player }: GoalieCareerStatsTableProps) {
	if (!player || !player.careerTotals) {
		return <div>Loading...</div>
	}

	return (
		<div className="mt-6 flow-root w-full overflow-hidden overflow-x-auto">
			<div className="inline-block min-w-full align-middle">
				<div className="rounded-lg bg-slate-700">
					<div className="md:hidden">
						<div className="mb-2 w-full rounded-md  p-4 bg-slate-600 text-white">
							<div className="flex items-center justify-between">
								<div className="w-full">
									<div className="flex justify-between items-center">
										<div>Games Played</div>
										<div>{player.careerTotals.regularSeason.gamesPlayed}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Wins</div>
										<div>{player.careerTotals.regularSeason.wins}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Losses</div>
										<div>{player.careerTotals.regularSeason.losses}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>OT Losses</div>
										<div>{player.careerTotals.regularSeason.otLosses}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Saves</div>
										<div>
											{player.careerTotals.regularSeason.shotsAgainst -
												player.careerTotals.regularSeason.goalsAgainst}
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div>GAA</div>
										<div>
											{RoundingService.roundToDecimal(
												player.careerTotals.regularSeason.goalsAgainstAvg,
												3,
											)}
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div>SV%</div>
										<div>
											{RoundingService.roundToDecimal(
												player.careerTotals.regularSeason.savePctg,
												3,
											)}
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div>SO</div>
										<div>{player.careerTotals.regularSeason.shutouts}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>G</div>
										<div>{player.careerTotals.regularSeason.goals}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>A</div>
										<div>{player.careerTotals.regularSeason.assists}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<table className="hidden md:table min-w-full border-collapse border border-gray-200 dark:border-slate-700">
						<thead>
							<tr className="bg-gray-100 dark:bg-slate-800">
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
									SA
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									GAA
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SV%
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SO
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									G
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									A
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-700 dark:even:bg-slate-800">
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.careerTotals.regularSeason.gamesPlayed}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.careerTotals.regularSeason.wins}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.careerTotals.regularSeason.losses}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.careerTotals.regularSeason.otLosses}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.careerTotals.regularSeason.shotsAgainst -
										player.careerTotals.regularSeason.goalsAgainst}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{RoundingService.roundToDecimal(
										player.careerTotals.regularSeason.goalsAgainstAvg,
										3,
									)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{RoundingService.roundToDecimal(player.careerTotals.regularSeason.savePctg, 3)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.careerTotals.regularSeason.shutouts}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.careerTotals.regularSeason.goals}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.careerTotals.regularSeason.assists}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
