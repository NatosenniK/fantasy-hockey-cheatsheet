import { PlayerProfile } from '@/app/lib/api/external/nhl/nhl-player.types'
import { TradePlayerCard } from './trade-player-card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

interface TradeOverviewProps {
	sideA: PlayerProfile[]
	sideB: PlayerProfile[]
	preferredSide: string
}
export default function TradeOverview(props: TradeOverviewProps) {
	return (
		<>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				<div>
					<div
						className={`flex justify-center items-center mb-6 min-h-10 ${
							props.preferredSide === 'outgoing' ? 'bg-green-700 rounded-md' : ''
						}`}
					>
						<h2 className="text-2xl font-semibold dark:text-white flex justify-center">Outgoing</h2>
						{props.preferredSide === 'outgoing' && (
							<div className="ml-6">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="fa-fw h-[32px] w-[32px] text-white-500 peer-focus:text-white-900"
								/>
							</div>
						)}
					</div>

					{props.sideA.map((player: PlayerProfile) => {
						return <TradePlayerCard key={player.playerId} player={player} />
					})}
				</div>

				<div>
					<div
						className={`flex justify-center items-center mb-6 min-h-10 ${
							props.preferredSide === 'incoming' ? 'bg-green-700 rounded-md' : ''
						}`}
					>
						<h2 className="text-2xl font-semibold dark:text-white flex justify-center">Incoming</h2>
						{props.preferredSide === 'incoming' && (
							<div className="ml-6">
								<FontAwesomeIcon
									icon={faCheckCircle}
									className="fa-fw h-[32px] w-[32px] text-white-500 peer-focus:text-white-900"
								/>
							</div>
						)}
					</div>

					{props.sideB.map((player: PlayerProfile) => {
						return <TradePlayerCard key={player.playerId} player={player} />
					})}
				</div>
			</div>
		</>
	)
}
