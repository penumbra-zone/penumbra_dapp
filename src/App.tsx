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
import { BalanceDetail, Home, SendTx, Validators } from './containers'
import { routesPath } from './utils/constants'
import { BalanceContextProvider } from './context'

export const getShortKey = (text: string) => {
	if (!text) return ''
	return text.slice(0, 10) + '..' + text.slice(-9)
}

export default function App() {
	useEffect(() => {
		console.log('updated 10.05.23')
	}, [])
	return (
		<AuthProvider>
			<Routes>
				<Route element={<Layout />}>
					<Route path={routesPath.HOME} element={<Home />} />
					<Route
						path={routesPath.SEND}
						element={
							<RequireAuth>
								<SendTx />
							</RequireAuth>
						}
					/>
					<Route
						path={routesPath.BALANCE_DETAIL}
						element={
							<RequireAuth>
								<BalanceDetail />
							</RequireAuth>
						}
					/>
					<Route
						path={routesPath.VALIDATORS}
						element={
							<RequireAuth>
								<Validators />
							</RequireAuth>
						}
					/>
				</Route>
			</Routes>
		</AuthProvider>
	)
}

function Layout() {
	let auth = useAuth()
	const navigate = useNavigate()
	const [isPenumbra, setIsPenumbra] = useState<boolean>(false)

	const checkIsPenumbraInstalled = async () => {
		const isInstalled = await isPenumbraInstalled()
		setIsPenumbra(isInstalled)
	}

	useEffect(() => {
		checkIsPenumbraInstalled()
	}, [])

	const handleClick = () => navigate(routesPath.HOME)

	return (
		<BalanceContextProvider>
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
								{auth.user ? (
									<div>
										<p className='h3'>
											{getShortKey(auth.user.addressByIndex)}
										</p>
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
		</BalanceContextProvider>
	)
}

interface AuthContextType {
	user: (UserData & { fvk: string }) | null
	signin: () => Promise<void>
}

let AuthContext = createContext<AuthContextType>(null!)

function AuthProvider({ children }: { children: React.ReactNode }) {
	let [user, setUser] = useState<null | (UserData & { fvk: string })>(null)

	let signin = async () => {
		const data = await window.penumbra.publicState()
		const account = data.account
		setUser(account)
	}

	let value = { user, signin }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	return useContext(AuthContext)
}

function RequireAuth({ children }: { children: JSX.Element }) {
	let auth = useAuth()
	let location = useLocation()

	if (!auth.user) {
		// Redirect them to the /login page, but save the current location they were
		// trying to go to when they were redirected. This allows us to send them
		// along to that page after they login, which is a nicer user experience
		// than dropping them off on the home page.
		return <Navigate to={routesPath.HOME} state={{ from: location }} replace />
	}

	return children
}
