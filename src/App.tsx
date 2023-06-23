import { createContext, useContext, useEffect, useState } from 'react'
import {
	Routes,
	Route,
	useLocation,
	Navigate,
	Outlet,
	useNavigate,
} from 'react-router-dom'
import { Button } from './components/Tab/Button'
import { UserData } from './Signer/types'
import { isPenumbraInstalled } from './utils/ProviderPenumbra'
import img from './assets/img/logo.png'
import {
	BalanceDetail,
	Home,
	SendTx,
	TransactionDetail,
	Validators,
} from './containers'
import { routesPath } from './utils/constants'
import { BalanceContextProvider, TransactionContextProvider } from './context'
import { ProgressBar } from './components/ProgressBar'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { createWebExtTransport } from './utils/webExtTransport'
import { StatusStreamRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createPromiseClient } from '@bufbuild/connect'

export const getShortKey = (text: string) => {
	if (!text) return ''
	return text.slice(0, 35) + '...'
}

export default function App() {
	useEffect(() => {
		console.log('updated 10.6.23')
	}, [])

	return (
		<AuthProvider>
			<Routes>
				<Route element={<Layout />}>
					<Route path={routesPath.HOME} element={<Home />} />
					<Route
						path={routesPath.SEND}
						element={
							// <RequireAuth>
							<SendTx />
							// </RequireAuth>
						}
					/>
					<Route
						path={routesPath.BALANCE_DETAIL}
						element={
							// <RequireAuth>
							<BalanceDetail />
							// </RequireAuth>
						}
					/>
					<Route
						path={routesPath.VALIDATORS}
						element={
							// <RequireAuth>
							<Validators />
							// </RequireAuth>
						}
					/>
					<Route
						path={routesPath.TRANSACTION}
						element={<TransactionDetail />}
					/>
				</Route>
			</Routes>
		</AuthProvider>
	)
}

export function percentage(partialValue: number, totalValue: number) {
	if (!totalValue) return 0
	return Math.round((100 * partialValue) / totalValue)
}

function Layout() {
	let auth = useAuth()
	const navigate = useNavigate()
	const [isPenumbra, setIsPenumbra] = useState<boolean>(false)
	const [percent, setPercent] = useState<number>(0)

	const checkIsPenumbraInstalled = async () => {
		const isInstalled = await isPenumbraInstalled()
		setIsPenumbra(isInstalled)
	}

	useEffect(() => {
		checkIsPenumbraInstalled()
	}, [])

	useEffect(() => {
		if (!auth.walletAddress) return setPercent(0)
		const getPercent = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				createWebExtTransport(ViewProtocolService)
			)

			const statusRequest = new StatusStreamRequest({})

			for await (const status of client.statusStream(statusRequest)) {
				setPercent(
					percentage(
						Number(status.syncHeight),
						Number(status.latestKnownBlockHeight)
					)
				)
			}
		}
		getPercent()
	}, [auth])

	const handleClick = () => navigate(routesPath.HOME)

	return (
		<BalanceContextProvider>
			<TransactionContextProvider>
				<div className='flex item-center justify-center mx-[104px]'>
					{!isPenumbra ? (
						<Button
							mode='gradient'
							title={
								<a
									href='https://chrome.google.com/webstore/detail/penumbra-wallet/lkpmkhpnhknhmibgnmmhdhgdilepfghe'
									target='_blank'
									rel='noreferrer'
								>
									Install Penumbra
								</a>
							}
							className='w-[200px] ext:pt-[14px] tablet:pt-[14px]  ext:pb-[14px] tablet:pb-[14px] mt-[300px]'
						/>
					) : (
						<>
							<div className='w-[100%] flex flex-col'>
								<div className='w-[100%] flex justify-between items-center'>
									<img
										src={img}
										alt='penumbra logo'
										className='w-[192px] object-cover cursor-pointer'
										onClick={handleClick}
									/>

									{auth.walletAddress ? (
										<div className='flex items-center justify-center h-[44px] py-[13px] px-[21px] gap-[8px] rounded-[10px] border-[1px] border-dark_grey bg-brown'>
											{percent > 100 ? (
												<></>
											) : (
												<div className='ext:w-[25px] ext:h-[25px] tablet:w-[35px] tablet:h-[35px] ext:mr-[6px] tablet:mr-[16px] flex items-center'>
													<ProgressBar percent={percent} width='42px' />
												</div>
											)}
											<p className='h3'>{getShortKey(auth.walletAddress)}</p>
										</div>
									) : (
										<Button
											mode='gradient'
											title='Connect'
											className='w-[200px]'
											onClick={auth.signin}
										/>
									)}
								</div>
								<Outlet />
							</div>
						</>
					)}
				</div>
			</TransactionContextProvider>
		</BalanceContextProvider>
	)
}

interface AuthContextType {
	user: (UserData & { fvk: string }) | null
	walletAddress?: string
	signin: () => Promise<void>
}

let AuthContext = createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
	let [user, setUser] = useState<null | (UserData & { fvk: string })>(null)
	const [walletAddress, setWalletAddress] = useState<string | undefined>()
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
			window.penumbra.on('accountsChanged', accounts => {
				setWalletAddress(accounts[0])
			})
		} else {
			/* Penumbra is not installed */
			setWalletAddress(undefined)
			console.log('Please install Penumbra Wallet')
		}
	}

	let signin = async () => {
		// const data = await window.penumbra.requestAccounts()
		// const account = data.account
		// setUser(account)
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
			console.log('Please install Penumbra Wallet')
		}
	}

	let value = { user, signin, walletAddress }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	return useContext(AuthContext)
}

function RequireAuth({ children }: { children: JSX.Element }) {
	let auth = useAuth()
	let location = useLocation()

	if (!auth.walletAddress) {
		// Redirect them to the /login page, but save the current location they were
		// trying to go to when they were redirected. This allows us to send them
		// along to that page after they login, which is a nicer user experience
		// than dropping them off on the home page.
		return <Navigate to={routesPath.HOME} state={{ from: location }} replace />
	}

	return children
}
