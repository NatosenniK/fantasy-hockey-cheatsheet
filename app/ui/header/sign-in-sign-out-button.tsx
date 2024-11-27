import { getSession, logout } from '@/app/lib/lib'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export async function SignInOutButton() {
	const session = await getSession()

	return (
		<>
			{session ? (
				<form
					action={async () => {
						'use server'
						await logout()
						redirect('/')
					}}
				>
					<button
						type="submit"
						className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mb-3 md:mb-0 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 dark:hover:text-white mr-2"
					>
						Logout
					</button>
				</form>
			) : (
				<Link
					key={'login'}
					href={'/login'}
					className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 mb-3 md:mb-0 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 dark:hover:text-white mr-2`}
				>
					<p className="">Login</p>
				</Link>
			)}
		</>
	)
}
