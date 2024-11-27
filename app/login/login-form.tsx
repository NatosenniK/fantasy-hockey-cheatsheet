import { redirect } from 'next/navigation'
import { getSession, login } from '../lib/lib'
import Link from 'next/link'
import { Button } from '@headlessui/react'

export default async function Login() {
	const session = await getSession()
	return (
		<>
			<form
				action={async (formData) => {
					'use server'
					await login(formData)
					redirect('/login')
				}}
				className="space-y-3"
			>
				<div className="bg-white dark:bg-slate-700 flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
					<h1 className={`mb-3 text-2xl dark:text-white`}>Please log in to continue.</h1>
					<div className="w-full">
						<div>
							<label
								className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-white"
								htmlFor="email"
							>
								Email
							</label>
							<div className="relative">
								<input
									className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-slate-800 dark:text-white"
									id="email"
									type="email"
									name="email"
									placeholder="Enter your email address"
									required
								/>
								{/* <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
							</div>
						</div>
						<div className="mt-4">
							<label
								className="mb-3 mt-5 block text-xs font-medium text-gray-900 dark:text-white"
								htmlFor="password"
							>
								Password
							</label>
							<div className="relative">
								<input
									className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:bg-slate-800 dark:text-white"
									id="password"
									type="password"
									name="password"
									placeholder="Enter password"
									required
									minLength={6}
								/>
								{/* <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 " /> */}
							</div>
						</div>
					</div>
					<Button type="submit" className="mt-4 w-full">
						Log in
					</Button>
					{/* <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
						{errorMessage && (
							<>
								<ExclamationCircleIcon className="h-5 w-5 text-red-500" />
								<p className="text-sm text-red-500">{errorMessage}</p>
							</>
						)}
					</div> */}
				</div>
			</form>
			<pre>{JSON.stringify(session, null, 2)}</pre>
			<Link
				href="/"
				className="flex items-center gap-5 self-start text-sm font-small text-blue-500 transition-colors hover:text-blue-400 md:text-base mr-3"
			>
				{/* <ArrowLeftIcon className="w-5 md:w-6" /> <span>Back to home</span> */}
			</Link>
		</>
	)
}
