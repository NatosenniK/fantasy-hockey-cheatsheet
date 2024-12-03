'use client'

// import { useSession } from '@/app/context/session-context'
import { MobileMenuButton } from '../visuals/mobile-menu-button'
import SiteLogo from '../visuals/site-logo'
import NavLinks from './nav-links'

// import { LoginButton, LogoutButton } from '../visuals/buttons'

export function HeaderElement() {
	// const { session, updateSession } = useSession()
	return (
		<header>
			<nav className="border-gray-200 px-4 lg:px-6 py-2.5 bg-gray-700">
				<div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-2xl">
					<SiteLogo />

					<div className="flex items-center lg:order-1">
						<div className="xl:hidden">
							<MobileMenuButton />
						</div>
					</div>
					<div
						className="hidden justify-between items-center w-full xl:flex xl:w-auto lg:order-2"
						id="mobile-menu-2"
					>
						<NavLinks />
						{/* {session ? <LogoutButton onLogout={updateSession} /> : <LoginButton />} */}
					</div>
				</div>
			</nav>
		</header>
	)
}
