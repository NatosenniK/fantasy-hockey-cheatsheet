import { playerPosition } from '@/app/utils/position.utl'
import { PlayerHeadshot } from '../visuals/headshot'
import { FantasyOutlookSkeleton } from '../visuals/skeletons'
import NHLTeamLogo from '../visuals/team-logo'
import { SelectedPlayerDetails } from '../search'

export function PlayerCard({
	player,
	fantasyOutlook,
	compare,
}: {
	player: SelectedPlayerDetails
	fantasyOutlook: string
	compare?: boolean
}) {
	return (
		<>
			<div className="flex items-stretch mb-6 flex-wrap md:flex-nowrap">
				<div className="bg-slate-700 rounded-lg p-3 md:mr-3 mb-3 md:mb-0 w-full md:w-full lg:w-auto flex flex-col items-center">
					<PlayerHeadshot width={150} height={150} imageUrl={player.playerProfile.headshot} />
					<h2 className="text-lg font-semibold mt-4 text-white">
						{player.playerProfile.firstName.default} {player.playerProfile.lastName.default}
					</h2>
					<div className="flex items-center">
						<NHLTeamLogo
							imageUrl={player.playerProfile.teamLogo}
							width={30}
							height={30}
							alt={`${player.playerProfile.currentTeamAbbrev}`}
						/>
						<div className="text-md px-3 border-slate-500 border-l border-r ml-3">
							{player.playerProfile.sweaterNumber}
						</div>
						<div className="text-md px-3 border-slate-500">
							{playerPosition(player.playerProfile.position)}
						</div>
					</div>
				</div>
				<div
					className={`bg-slate-700 rounded-lg p-3 mb-3 md:mb-0 flex flex-col w-full md:w-full lg:w-auto w-56 items-center ${compare ? 'flex-grow mr-0' : ' md:mr-3 '}`}
				>
					<div className="flex-grow flex items-center justify-center w-56">
						<div className="text-7xl">{player.expectedWeeklyPointTotal.toFixed(2)}</div>
					</div>
					<h3 className="font-medium text-gray-900 text-white flex justify-center">
						Expected Weekly Point Total
					</h3>
				</div>

				{!compare && (
					<div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow">
						<h2 className="text-xl font-semibold mb-4 dark:text-white">Fantasy Outlook</h2>
						{fantasyOutlook === '' ? (
							<FantasyOutlookSkeleton />
						) : (
							<div className="text-white md:h-20" dangerouslySetInnerHTML={{ __html: fantasyOutlook }} />
						)}
					</div>
				)}
			</div>
			{compare && (
				<div className="rounded-lg bg-slate-700 p-3 flex flex-col justify-center flex-grow mb-6">
					<h2 className="text-xl font-semibold mb-4 dark:text-white">Fantasy Outlook</h2>
					{fantasyOutlook === '' ? (
						<FantasyOutlookSkeleton />
					) : (
						<div className="text-white" dangerouslySetInnerHTML={{ __html: fantasyOutlook }} />
					)}
				</div>
			)}
		</>
	)
}
