import { NHLTeamAPI } from '@/app/lib/api/external/nhl/nhl-teams.api'
import NHLTeamLogo from '../visuals/team-logo'
import { RoundingService } from '@/app/utils/rounding-util'
import clsx from 'clsx'

export default async function TeamTable() {
	const teams = await NHLTeamAPI.fetchTeams()

	if (!Array.isArray(teams)) {
		return <div>No standings data available.</div>
	}

	return (
		<div className="mt-6 flow-root w-full">
			<div className="inline-block min-w-full align-middle">
				<div className="rounded-lg bg-gray-50 p-2 md:pt-0 dark:bg-slate-700">
					<div className="md:hidden">
						{teams?.map((team, index) => (
							<div
								key={index}
								className="mb-2 w-full rounded-md bg-white p-4 dark:bg-slate-600 dark:text-white"
							>
								<div className="flex items-center justify-between">
									<div className="mr-4">{index + 1}</div>
									<div className="w-full">
										<div className="flex justify-between items-center">
											<div>
												<NHLTeamLogo
													imageUrl={team.teamLogo}
													width={50}
													height={50}
													alt={team.teamName.default}
												/>
												{team.teamName.default}
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					<table className="hidden min-w-full text-gray-900 dark:text-white md:table">
						<thead className="rounded-lg text-left text-sm font-normal">
							<tr>
								<th scope="col" className="px-3 py-5 font-medium">
									Rank
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									Team
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									Wins
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									Losses
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									OT Losses
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									Points
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									Points %
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									RW
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									ROW
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									GF
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									GA
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									DIFF
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									HOME
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									AWAY
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									S/O
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									L10
								</th>
								<th scope="col" className="px-3 py-5 font-medium">
									STRK
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-slate-700">
							{teams?.map((team, index) => (
								<tr
									key={index}
									className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
								>
									<td className="whitespace-nowrap px-3 py-3">{index + 1}</td>
									<td className="whitespace-nowrap px-3 py-3">
										<div className="flex items-center">
											<NHLTeamLogo
												imageUrl={team.teamLogo}
												width={50}
												height={50}
												alt={team.teamName.default}
											/>
											<div className="ml-3">{team.teamName.default}</div>
										</div>
									</td>
									<td className="whitespace-nowrap px-3 py-3">{team.wins}</td>
									<td className="whitespace-nowrap px-3 py-3">{team.losses}</td>
									<td className="whitespace-nowrap px-3 py-3">{team.otLosses}</td>
									<td className="whitespace-nowrap px-3 py-3">{team.points}</td>
									<td className="whitespace-nowrap px-3 py-3">
										{RoundingService.roundToDecimal(team.pointPctg, 3)}
									</td>
									<td className="whitespace-nowrap px-3 py-3">{team.regulationWins}</td>
									<td className="whitespace-nowrap px-3 py-3">{team.regulationPlusOtWins}</td>
									<td className="whitespace-nowrap px-3 py-3">{team.goalFor}</td>
									<td className="whitespace-nowrap px-3 py-3">{team.goalAgainst}</td>
									<td
										className={clsx(
											'whitespace-nowrap px-3 py-3',
											{
												'text-green-600': team.goalDifferential > 0,
											},
											{
												'text-red-600': team.goalDifferential < 0,
											},
										)}
									>
										{team.goalDifferential > 0
											? `+${team.goalDifferential}`
											: team.goalDifferential}
									</td>
									<td className="whitespace-nowrap px-3 py-3">
										{team.homeWins}-{team.homeLosses}-{team.homeOtLosses}
									</td>
									<td className="whitespace-nowrap px-3 py-3">
										{team.roadWins}-{team.roadLosses}-{team.roadOtLosses}
									</td>
									<td className="whitespace-nowrap px-3 py-3">
										{team.shootoutWins}-{team.shootoutLosses}
									</td>
									<td className="whitespace-nowrap px-3 py-3">
										{team.l10Wins}-{team.l10Losses}-{team.l10OtLosses}
									</td>
									<td className="whitespace-nowrap px-3 py-3">
										{team.streakCode}
										{team.streakCount}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
