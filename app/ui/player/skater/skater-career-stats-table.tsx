import { SkaterProfile } from '@/app/lib/api/external/nhl/nhl-player.types'
import { RoundingService } from '@/app/utils/rounding-util'

interface FullStatsTableProps {
	player: SkaterProfile
}
export default function SkaterCareerStatsTable({ player }: FullStatsTableProps) {
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
										<div>{player.featuredStats.regularSeason.subSeason.gamesPlayed}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Goals</div>
										<div>{player.featuredStats.regularSeason.subSeason.goals}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Assists</div>
										<div>{player.featuredStats.regularSeason.subSeason.assists}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Points</div>
										<div>{player.featuredStats.regularSeason.subSeason.points}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>+/-</div>
										<div>
											{player.featuredStats.regularSeason.subSeason.plusMinus > 0
												? `+${player.featuredStats.regularSeason.subSeason.plusMinus}`
												: player.featuredStats.regularSeason.subSeason.plusMinus}
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div>PIM</div>
										<div>{player.featuredStats.regularSeason.subSeason.pim}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>Shots</div>
										<div>{player.featuredStats.regularSeason.subSeason.shots}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>S%</div>
										<div>
											{RoundingService.roundToDecimal(
												player.featuredStats.regularSeason.subSeason.shootingPctg,
												3,
											)}
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div>PPG</div>
										<div>{player.featuredStats.regularSeason.subSeason.powerPlayGoals}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>PP Points</div>
										<div>{player.featuredStats.regularSeason.subSeason.powerPlayPoints}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>SHG</div>
										<div>{player.featuredStats.regularSeason.subSeason.shorthandedGoals}</div>
									</div>
									<div className="flex justify-between items-center">
										<div>SH Points</div>
										<div>{player.featuredStats.regularSeason.subSeason.shorthandedPoints}</div>
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
									Shots
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									PPG
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									PP Points
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									S%
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SHG
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									SH Points
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-slate-700 dark:even:bg-slate-800">
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.gamesPlayed}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.goals}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.assists}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.points}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.plusMinus > 0
										? `+${player.featuredStats.regularSeason.subSeason.plusMinus}`
										: player.featuredStats.regularSeason.subSeason.plusMinus}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.pim}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.shots}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.powerPlayGoals}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.powerPlayPoints}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{RoundingService.roundToDecimal(
										player.featuredStats.regularSeason.subSeason.shootingPctg,
										3,
									)}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.shorthandedGoals}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700">
									{player.featuredStats.regularSeason.subSeason.shorthandedPoints}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
