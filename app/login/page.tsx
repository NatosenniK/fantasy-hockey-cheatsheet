import Login from './login-form'

export default async function LoginPage() {
	return (
		<div className="">
			<main className="flex flex-col gap-8 row-start-2 items-center justify-center">
				<div className="w-full pt-6 max-w-lg">
					<div>
						<h1 className="text-lg font-semibold mt-4 text-white mb-6">
							Login to Fantasy Hockey Cheatsheet
						</h1>
						<Login />
					</div>
				</div>
			</main>
		</div>
	)
}
