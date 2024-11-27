'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const SessionContext = createContext({
	session: null,
	updateSession: async () => {},
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState(null)
	const pathname = usePathname()

	// Fetch session data
	async function fetchSession() {
		const response = await fetch('/api/user/auth/session')
		const data = await response.json()
		setSession(data.session)
	}

	useEffect(() => {
		fetchSession()
	}, [pathname])

	return (
		<SessionContext.Provider value={{ session, updateSession: fetchSession }}>{children}</SessionContext.Provider>
	)
}

export function useSession() {
	return useContext(SessionContext)
}
