import { Suspense } from 'react'
import SearchCompare from '../ui/compare/compare'
import PlayerStatSkeleton from '../ui/visuals/skeletons'

export default async function ComparePlayers() {
	return (
		<div className="mt-6">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div className="w-full">
					<div className="grid grid-cols-1">
						<Suspense fallback={<PlayerStatSkeleton />}>
							<SearchCompare />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
