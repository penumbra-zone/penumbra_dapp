'use client'
import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
	walletAddress: string
	signin?: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
	walletAddress: '',
})

const poll = (
	resolve: (result: boolean) => void,
	reject: (...args: unknown[]) => void,
	attempt = 0,
	retries = 30,
	interval = 100
) => {
	if (attempt > retries) return resolve(false)

	if (typeof window !== 'undefined' && 'undefined') {
		return resolve(true)
	} else setTimeout(() => poll(resolve, reject, ++attempt), interval)
}

const _isPenumbraInstalled = new Promise(poll)

export async function isPenumbraInstalled() {
	return _isPenumbraInstalled
}

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [walletAddress, setWalletAddress] = useState<string>('')
	const [isPenumbra, setIsPenumbra] = useState<boolean>(false)

	const checkIsPenumbraInstalled = async () => {
		const isInstalled = await isPenumbraInstalled()
		setIsPenumbra(isInstalled)
	}

	useEffect(() => {
		checkIsPenumbraInstalled()
	}, [])

	useEffect(() => {
		if (!isPenumbra) return
		addWalletListener(isPenumbra)
	}, [isPenumbra])

	const addWalletListener = async (isPenumbra: boolean) => {
		if (isPenumbra) {
			window.penumbra.on('accountsChanged', (accounts: [string]) => {
				setWalletAddress(accounts[0])
			})
		} else {
			/* Penumbra is not installed */
			setWalletAddress('')
		}
	}

	let signin = async () => {
		if (isPenumbra) {
			try {
				/* Penumbra is installed */
				const accounts = await window.penumbra.requestAccounts()
				setWalletAddress(accounts[0])
			} catch (err) {
				console.error(err)
			}
		} else {
			/* Penumbra is not installed */
		}
	}

	let value = { signin, walletAddress }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	return useContext(AuthContext)
}
