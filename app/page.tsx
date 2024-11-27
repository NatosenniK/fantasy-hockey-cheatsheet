import { Suspense } from 'react'
import PlayerStatSkeleton from './ui/visuals/skeletons'
import SearchWithPlayer from './ui/player/player'
import { getSession } from './lib/auth'

export default async function Home() {
	const session = await getSession()
	let username = 'Fantasy Hockey Player'

	if (session) {
		username = session.user.name
	}
	return (
		<div className="mt-6">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div className="w-full">
					<div className="mt-6 mb-6 text-lg">Welcome, {username}</div>
					<Suspense fallback={<PlayerStatSkeleton />}>
						<SearchWithPlayer />
					</Suspense>
				</div>
			</main>
		</div>
	)
}
