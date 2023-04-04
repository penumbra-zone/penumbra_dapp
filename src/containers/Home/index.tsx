import { BalanceByAddressResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useEffect, useState } from 'react'
import { useAuth } from '../../App'
import { ActivityList } from '../../components/ActivityList'
import { AssetsList } from '../../components/AssetsList'
import { BalanceAction } from '../../components/BalanceAction'
import { Tabs } from '../../components/Tab'
import { uint8ToBase64 } from '../SendTx'

export const Home = () => {
	let auth = useAuth()

	const [balance, setBalance] = useState<
		Record<string, BalanceByAddressResponse>
	>({})

	useEffect(() => {
		if (!auth.user) return
		window.penumbra.on('balance', balance => {
			const id = uint8ToBase64(balance.asset.inner)

			setBalance(state => ({
				...state,
				[id]: balance,
			}))
		})
	}, [auth])

	return (
		<>
			{auth.user ? (
				<div className='py-[16px] flex flex-col items-center justify-center bg-brown rounded-[15px]'>
					<BalanceAction />
					<Tabs
						tabs={['Assets', 'Activity']}
						children={(type: string) =>
							type === 'Assets' ? (
								<AssetsList
									assets={
										balance
									}
								/>
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
