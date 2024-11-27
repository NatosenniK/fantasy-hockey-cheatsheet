'use client'

import Link from 'next/link'
import { redirect } from 'next/navigation'

export function LogoutButton({ onLogout }: { onLogout: () => void }) {
	async function handleLogout(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const response = await fetch('/api/user/logout', {
			method: 'POST',
		})

		if (response.ok) {
			console.log('Logout successful')
			onLogout()
			redirect('/')
		} else {
			const errorData = await response.json()
			console.error('Logout failed:', errorData.message || 'Unknown error')
		}
	}

	return (
		<form onSubmit={handleLogout}>
			<button
				type="submit"
				className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mb-3 md:mb-0 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 dark:hover:text-white mr-2"
			>
				Logout
			</button>
		</form>
	)
}

export function LoginButton() {
	return (
		<Link
			key={'login'}
			href={'/login'}
			className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mb-3 md:mb-0 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 dark:hover:text-white mr-2`}
		>
			<p className="">Login</p>
		</Link>
	)
}
