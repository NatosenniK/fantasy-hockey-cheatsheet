'use client'

import { Button } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { redirect } from 'next/navigation'

export default function Login() {
	async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		// Validate email and password
		if (!email || !password) {
			console.error('Email and password are required.')
			return
		}

		const response = await fetch('/api/user/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})

		if (response.ok) {
			const data = await response.json()
			console.log('Login successful:', data)
			redirect('/')
		} else {
			const errorData = await response.json()
			console.error('Login failed:', errorData.message || 'Unknown error')
		}
	}

	return (
		<>
			<form onSubmit={handleLogin} className="space-y-3">
				<div className="bg-white dark:bg-slate-700 flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
					<h1 className={`mb-3 text-2xl dark:text-white`}>Please log in to continue</h1>
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
								<FontAwesomeIcon
									icon={faUser}
									className="fa-fw pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
								/>
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
								<FontAwesomeIcon
									icon={faKey}
									className="fa-fw pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
								/>
							</div>
						</div>
					</div>
					<Button type="submit" className="mt-4 w-full rounded-md  bg-slate-800 py-3 hover:bg-slate-600">
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
		</>
	)
}
