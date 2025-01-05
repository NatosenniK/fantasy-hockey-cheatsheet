import { PlayerProfile } from '@/app/lib/api/external/nhl/nhl-player.types'
import { TradePlayerCard } from './trade-player-card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

interface TradeOverviewProps {
	sideA: PlayerProfile[]
	sideB: PlayerProfile[]
}
export default function TradeOverview(props: TradeOverviewProps) {
	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				<div>
					<div>
						<h2 className="text-2xl font-semibold mb-4 dark:text-white mb-6 flex justify-center">
							Outgoing
						</h2>
						{/* {props.preferredSide === 'outgoing' && (
							<div className="absolute top-8 left-1/2">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="fa-fw h-[32px] w-[32px] -translate-y-1/2 text-green-500 peer-focus:text-green-900"
								/>
							</div>
						)} */}
					</div>

					{props.sideA.map((player: PlayerProfile) => {
						return <TradePlayerCard key={player.playerId} player={player} />
					})}
				</div>

				<div>
					<div>
						<h2 className="text-2xl font-semibold mb-4 dark:text-white mb-6 flex justify-center">
							Incoming
						</h2>
						{/* {props.preferredSide === 'incoming' && (
							<div className="absolute top-8 left-1/2">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="fa-fw h-[32px] w-[32px] -translate-y-1/2 text-green-500 peer-focus:text-green-900"
								/>
							</div>
						)} */}
					</div>

					{props.sideB.map((player: PlayerProfile) => {
						return <TradePlayerCard key={player.playerId} player={player} />
					})}
				</div>
			</div>
		</>
	)
}
