'use client'
import { AuthContextProvider } from '@/context/AuthContextProvider'
import './globals.css'
import { Header } from '@/components/Header'
import { BalanceContextProvider } from '@/context/BalanceContextProvider'
import { TransactionContextProvider } from '@/context/TransactionContext'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	useEffect(() => {
		console.log('12.07.23');
		
	}, [])
	return (
		<html lang='en'>
			<body>
				<link rel='icon' href='/favicon.ico' sizes='any' />
				<meta name='description' content='app.testnet.penumbra.zone' />
				<title>Penumbra dApp</title>
				<AuthContextProvider>
					<BalanceContextProvider>
						<TransactionContextProvider>
							<div className='flex flex-col item-center justify-center mx-[104px]'>
								<Header />
								{children}
								<Toaster />
							</div>
						</TransactionContextProvider>
					</BalanceContextProvider>
				</AuthContextProvider>
				<div id='app-modal' />
			</body>
		</html>
	)
}
