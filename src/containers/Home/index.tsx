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
import { Button } from '../../components/Tab/Button'
import { useNavigate } from 'react-router-dom'
import { routesPath } from '../../utils/constants'

export const Home = () => {
	let auth = useAuth()
	const navigate = useNavigate()

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

	const handleStake = () => 
		navigate(routesPath.VALIDATORS)
	

	return (
		<>
			{auth.user ? (
				<div className='py-[16px] flex flex-col items-center justify-center bg-brown rounded-[15px]'>
					<BalanceAction />
					<div className='w-[100%] flex items-center justify-between ext:py-[15.5px] tablet:py-[13.5px] px-[18px] border-y-[1px] border-solid border-dark_grey'>
						<div className='flex flex-col'>
							<p className='text_button mb-[4px]'>Stake</p>
							{/* <p className="text_body text-light_grey">Earn to 21% per year</p> */}
						</div>
						<Button
							mode='transparent'
							onClick={handleStake}
							title='Stake'
							className='w-[119px] ext:pt-[7px] tablet:pt-[7px] ext:pb-[7px] tablet:pb-[7px]'
						/>
					</div>
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
