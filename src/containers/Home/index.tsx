import { BalanceByAddressResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useEffect, useState } from 'react'
import { useAuth } from '../../App'
import { ActivityList } from '../../components/ActivityList'
import { AssetsList } from '../../components/AssetsList'
import { BalanceAction } from '../../components/BalanceAction'
import { Tabs } from '../../components/Tab'

export const Home = () => {
	let auth = useAuth()

	const [balance, setBalance] = useState<BalanceByAddressResponse>()

	useEffect(() => {
		if (!auth.user) return
		window.penumbra.on('balance', balance => setBalance(balance))
	}, [auth])

	return (
		<>
			{auth.user ? (
				<div className='pt-[16px] flex flex-col items-center justify-center bg-brown rounded-[15px]'>
					<BalanceAction />
					<Tabs
						tabs={['Assets', 'Activity']}
						children={(type: string) =>
							type === 'Assets' ? (
								<AssetsList balance={balance} />
							) : (
								<ActivityList />
							)
						}
						className='bg-brown'
					/>
				</div>
			) : (
				<p className='h1 mt-[300px] text-center'>
					Connect to Penumbra if you want to have access to request
				</p>
			)}
		</>
	)
}
