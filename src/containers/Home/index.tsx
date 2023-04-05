import {
	AssetsResponse,
	BalanceByAddressResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
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
		Record<string, BalanceByAddressResponse & { denom: { denom: string } }>
	>({})
	const [assets, setAssets] = useState<AssetsResponse[]>([])

	useEffect(() => {
		if (!auth.user) return
		window.penumbra.on('assets', asset => {
			setAssets(state => [...state, asset])
		})
	}, [auth])

	useEffect(() => {
		if (!assets.length) return

		window.penumbra.on('balance', balance => {
			const id = uint8ToBase64(balance.asset.inner)
			const asset = assets.find(
				i => uint8ToBase64(i.asset?.id?.inner as Uint8Array) === id
			)?.asset

			setBalance(state => ({
				...state,
				[id]: { ...balance, denom: asset?.denom },
			}))
		})
	}, [assets])

	return (
		<>
			{auth.user ? (
				<div className='py-[16px] flex flex-col items-center justify-center bg-brown rounded-[15px]'>
					<BalanceAction />
					<Tabs
						tabs={['Assets', 'Activity']}
						children={(type: string) =>
							type === 'Assets' ? (
								<AssetsList assets={balance} />
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
