'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import NavLinks from '../nav-links'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

// import SignInSignOutSession from '../sign-in-sign-out-button'

export default function MobileMenuSideSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	return (
		<Dialog open={isOpen} onClose={onClose} className="relative z-10">
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
			/>

			<div className="fixed inset-0 overflow-hidden">
				<div className="absolute inset-0 overflow-hidden" onClick={onClose}>
					<div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
						<DialogPanel
							transition
							className="pointer-events-auto relative w-screen max-w-xs transform transition duration-500 ease-in-out data-[closed]:-translate-x-full sm:duration-700"
						>
							<TransitionChild>
								<div className="absolute right-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
									<button
										type="button"
										onClick={onClose}
										className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
									>
										<span className="absolute -inset-2.5" />
										<span className="sr-only">Close panel</span>
										<FontAwesomeIcon icon={faX} className="fa-fw" />
									</button>
								</div>
							</TransitionChild>
							<div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl dark:bg-slate-700">
								<div className="px-4 sm:px-6">
									<DialogTitle className="text-base font-semibold leading-6 text-gray-900 dark:text-white mb-5">
										Fantasy Hockey Cheatsheet
									</DialogTitle>
									<NavLinks />
									{/* <SignInSignOutSession /> */}
								</div>
								<div className="relative mt-6 flex-1 px-4 sm:px-6">{/* Your content */}</div>
							</div>
						</DialogPanel>
					</div>
				</div>
			</div>
		</Dialog>
	)
}
