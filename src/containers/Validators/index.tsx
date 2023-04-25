import { useEffect, useMemo, useState } from 'react'
import { Tabs } from '../../components/Tab'
import { Button } from '../../components/Tab/Button'
import {
	AssetsResponse,
	BalanceByAddressResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useAuth } from '../../App'
import { ObliviousQueryService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-web/penumbra/client/v1alpha1/client_connectweb'
import { uint8ToBase64 } from '../SendTx'
import { ValidatorInfo } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/stake/v1alpha1/stake_pb'
import { createGrpcWebTransport } from '@bufbuild/connect-web'
import { createPromiseClient } from '@bufbuild/connect'
import { ValidatorInfoRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/client/v1alpha1/client_pb'
import { AllValidators } from '../../components/AllValidators'

export const Validators = () => {
	let auth = useAuth()
	const [balance, setBalance] = useState<
		Record<string, BalanceByAddressResponse & { denom: { denom: string } }>
	>({})
	const [assets, setAssets] = useState<AssetsResponse[]>([])
	const [validators, setValidators] = useState<ValidatorInfo[]>([])

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

	const getValidators = async () => {
		const transport = createGrpcWebTransport({
			baseUrl: 'https://testnet1.penumbra.zone',
		})
		const client = createPromiseClient(ObliviousQueryService, transport)

		const validatorInfoRequest = new ValidatorInfoRequest()
		validatorInfoRequest.chainId = 'penumbra-testnet-elara'
		validatorInfoRequest.showInactive = true

		try {
			for await (const response of client.validatorInfo(validatorInfoRequest)) {
				setValidators(state => [...state, response.validatorInfo!])
			}
		} catch (error) {}
	}

	useEffect(() => {
		getValidators()
	}, [])

	const denom = useMemo(() => {
		return balance['KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA=']
			? balance['KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA='].denom.denom
			: ''
	}, [balance])

	return (
		<div className='w-[100%] mt-[20px] mb-[20px]'>
			<div className='mx-[0px] flex flex-col items-center'>
				<div className='w-[100%] flex items-center justify-between rounded-[15px] bg-brown py-[24px] px-[20px] mb-[24px]'>
					<div className='flex flex-col'>
						<p className='h3 mb-[16px]'>Total {denom} amount </p>
						<p className='text_numbers pb-[4px]'>
							{(
								Number(
									balance['KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA=']
										? balance['KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA=']
												.amount!.lo
										: 0
								) /
								10 ** 6
							).toLocaleString('en-US')}{' '}
							{denom}
						</p>
						<div className='flex text_numbers_s'>
							<p>~ $ -</p>
							<p className='text-green mx-[4px]'>(0%)</p>
							<p>24h</p>
						</div>
					</div>
					<div className='flex'>
						<Button
							mode='transparent'
							title='Send'
							className='w-[110px] tablet:py-[9px]'
						/>
						<Button
							mode='gradient'
							title='Deposit'
							className='w-[110px] ml-[16px] tablet:py-[9px]'
						/>
					</div>
				</div>
				<div className='w-[100%] flex items-center justify-between rounded-[15px] bg-brown py-[24px] px-[20px] mb-[40px]'>
					<div className='flex flex-col'>
						<p className='h3 mb-[8px]'>Staked Amount</p>
						<p className='text_numbers mb-[4px]'>0 {denom}</p>
						<p className='text_numbers_s'>~ $ -</p>
					</div>
					<div className='flex flex-col border-l-[1px] border-solid border-light_brown pl-[24px]'>
						<p className='h3 mb-[8px]'>Available Balance</p>
						<p className='text_numbers pb-[4px]'>
							{(
								Number(
									balance['KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA=']
										? balance['KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA=']
												.amount!.lo
										: 0
								) /
								10 ** 6
							).toLocaleString('en-US')}{' '}
							{denom}
						</p>
						<p className='text_numbers_s'>~ $ -</p>
					</div>
					<div className='flex flex-col border-l-[1px] border-solid border-light_brown pl-[24px]'>
						<p className='h3 mb-[8px]'>Claimable Rewards</p>
						<p className='text_numbers mb-[14px] '>~ $ -</p>
					</div>
					<Button
						mode='gradient'
						title='Claim'
						className='w-[110px] ml-[16px] tablet:py-[9px]'
					/>
				</div>
			</div>
			<Tabs
				tabs={['All Penumbra Validators', 'My Validators']}
				className='bg-[#000000]'
				children={(type: string) =>
					type === 'All Penumbra Validators' ? (
						<AllValidators validators={validators} denom={denom} />
					) : (
						<div className=' flex items-center justify-center w-[100%] bg-brown rounded-[15px] h-[400px] text_body text-light_brown'>
							There are not validators
						</div>
					)
				}
			/>
		</div>
	)
}
