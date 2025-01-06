import { Suspense } from 'react'
import PlayerStatSkeleton from '../ui/visuals/skeletons'
import TradeCalculator from '../ui/trade-calculator/trade-calculator'

export default function TradeCalculatorPage() {
	return (
		<div className="mt-6">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div className="w-full">
					<div className="grid grid-cols-1">
						<Suspense fallback={<PlayerStatSkeleton />}>
							<TradeCalculator />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
