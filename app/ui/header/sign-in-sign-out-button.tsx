'use client'

import { useEffect, useState } from 'react'
import { LoginButton, LogoutButton } from '../visuals/buttons'

export default function SignInSignOutSession() {
	const [session, setSession] = useState(null)

	async function fetchSession() {
		const response = await fetch('/api/user/auth/session')
		const data = await response.json()
		console.log('UE ', data)
		setSession(data.session)
	}

	useEffect(() => {
		fetchSession()
	}, [])

	return session ? <LogoutButton onLogout={fetchSession} /> : <LoginButton />
}
