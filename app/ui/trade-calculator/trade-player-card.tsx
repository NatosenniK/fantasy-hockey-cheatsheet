import { playerPosition } from '@/app/utils/position.utl'
import { PlayerHeadshot } from '../visuals/headshot'
import NHLTeamLogo from '../visuals/team-logo'
import { GoalieProfile, PlayerProfile, SkaterProfile } from '@/app/lib/api/external/nhl/nhl-player.types'
import GoalieCareerStatsTable from '../player/goalie/goalie-career-stats-table'
import SkaterCareerStatsTable from '../player/skater/skater-career-stats-table'

export function TradePlayerCard({ player }: { player: PlayerProfile }) {
	return (
		<>
			<div className="flex items-stretch mb-6 flex-wrap md:flex-nowrap overflow-hidden">
				<div className="bg-slate-700 rounded-lg p-3 md:mr-3 mb-3 md:mb-0 w-full md:w-full lg:w-auto flex flex-col items-center">
					<div className="flex flex-col items-center">
						<PlayerHeadshot width={150} height={150} imageUrl={player.headshot} />
						<h2 className="text-lg font-semibold mt-4 text-white">
							{player.firstName.default} {player.lastName.default}
						</h2>
						<div className="flex items-center">
							<NHLTeamLogo
								imageUrl={player.teamLogo}
								width={30}
								height={30}
								alt={`${player.currentTeamAbbrev}`}
							/>
							<div className="text-md px-3 border-slate-500 border-l border-r ml-3">
								{player.sweaterNumber}
							</div>
							<div className="text-md px-3 border-slate-500">{playerPosition(player.position)}</div>
						</div>
					</div>

					<div className="flex">
						{player.position === 'G' ? (
							<GoalieCareerStatsTable player={player as GoalieProfile} />
						) : (
							<SkaterCareerStatsTable player={player as SkaterProfile} condense={true} />
						)}
					</div>
				</div>
			</div>
		</>
	)
}
