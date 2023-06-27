
import { AuthContextProvider } from '@/context/AuthContextProvider'
import './globals.css'
import { Header } from '@/components/Header'
import { BalanceContextProvider } from '@/context/BalanceContextProvider'
import { TransactionContextProvider } from '@/context/TransactionContext'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body>
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
