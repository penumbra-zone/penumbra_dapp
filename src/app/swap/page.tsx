'use client'

import { Button, ChevronLeftIcon, Input, Select } from '@/components'
import { useAuth, useBalance } from '@/context'
import { useTransactionValues } from '@/hooks'
import { extensionTransport, routesPath } from '@/lib'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { TransactionPlannerRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createPromiseClient } from '@bufbuild/connect'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

export default function Swap() {
	const { balance } = useBalance()
	const auth = useAuth()
	const { push } = useRouter()
	const {
		values,
		isValidate,
		handleChangeSelect,
		handleChangeInput,
		handleMax,
		clearState,
	} = useTransactionValues()

	useEffect(() => {
		if (!auth.walletAddress) clearState()
	}, [auth.walletAddress])

	const options1 = useMemo(() => {
		if (!balance.length) return []
		return balance
			.filter(i => i.display === 'gm' || i.display === 'gn')
			.map(i => {
				if (!i.display) return { value: '', label: '' }
				return {
					value: i.display,
					label: (
						<div className='flex flex-col'>
							<p className='text_numbers break-all'>{i.display}</p>
							<div className='flex items-center'>
								<p className='text_body text-light_grey'>Balance:</p>
								<p className='text_numbers_s text-light_grey ml-[16px]'>
									{i.amount.toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 20,
									})}
								</p>
							</div>
						</div>
					),
				}
			})
	}, [balance])

	const options2 = useMemo(() => {
		if (!balance.length) return []
		return balance
			.filter(i => i.display === 'penumbra')
			.map(i => {
				if (!i.display) return { value: '', label: '' }
				return {
					value: i.display,
					label: (
						<div className='flex flex-col'>
							<p className='text_numbers break-all'>{i.display}</p>
							<div className='flex items-center'>
								<p className='text_body text-light_grey'>Balance:</p>
								<p className='text_numbers_s text-light_grey ml-[16px]'>
									{i.amount.toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 20,
									})}
								</p>
							</div>
						</div>
					),
				}
			})
	}, [balance])

	const handleBack = () => push(routesPath.HOME)

	const sendTransaction = async () => {
		try {
			const asset1 = balance.find(i => i.display === values.asset1)

			const asset2 = balance.find(i => i.display === values.asset2)

			if (!asset1 || !asset2 || !values.amount) return

			const asset1Exponent = asset1.exponent

			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)

			const value = {
				amount: {
					lo: BigInt(
						Number(values.amount) * (asset1Exponent ? 10 ** asset1Exponent : 1)
					),
					hi: BigInt(0),
				},
				assetId: { inner: asset1.assetId?.inner },
			}

			const fee = {
				amount: {
					hi: BigInt(0),
					lo: BigInt(0),
				},
			}

			const transactionPlan = (
				await client.transactionPlanner(
					new TransactionPlannerRequest({
						swaps: [
							{
								value,
								targetAsset: asset2.assetId,
								fee,
							},
						],
					})
				)
			).plan

			const tx = await window.penumbra.signTransaction(
				transactionPlan?.toJson()
			)

			if (tx.result.code === 0) {
				push(`${routesPath.HOME}?tab=Activity`)
			} else {
				console.log(tx.result)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			{auth!.walletAddress ? (
				<div className='w-[100%] flex flex-col items-center'>
					<div className='w-[400px] flex flex-col justify-center mt-[24px] mb-[40px]'>
						<Button
							mode='icon_transparent'
							onClick={handleBack}
							title='Back'
							iconLeft={<ChevronLeftIcon stroke='#E0E0E0' />}
							className='self-start'
						/>
						<p className='h1 mt-[24px]'>Swap</p>

						<div className='bg-brown rounded-[10px] w-[100%] flex flex-col justify-between p-[16px]'>
							<div className='flex flex-col'>
								<Select
									labelClassName='h3 mb-[8px]'
									label='From :'
									options={options1}
									handleChange={handleChangeSelect('asset1')}
									initialValue={values.asset2}
									className='mb-[24px]'
								/>
								<Input
									labelClassName='h3 text-light_grey mb-[8px]'
									label='Total :'
									value={values.amount}
									isError={
										values.asset1
											? balance.find(i => values.asset1 === i.display)!.amount <
											  Number(values.amount)
											: false
									}
									onChange={handleChangeInput('amount')}
									helperText={'You do not have enough token'}
									rightElement={
										<div
											className='flex items-center bg-dark_grey h-[42px] px-[25px] rounded-r-[10px] text_button_ext cursor-pointer'
											onClick={handleMax}
										>
											Max
										</div>
									}
								/>
								<Select
									labelClassName='h3 mb-[8px]'
									label='To :'
									options={options2}
									handleChange={handleChangeSelect('asset2')}
									initialValue={values.asset2}
									disable
									className='mb-[24px]'
								/>
							</div>
							<div className='w-[100%] flex items-center gap-x-[8px] mt-[24px]'>
								<Button
									mode='transparent'
									onClick={handleBack}
									title='Cancel'
									className='h-[44px]'
								/>
								<Button
									mode='gradient'
									onClick={sendTransaction}
									title='Send'
									className='h-[44px]'
									disabled={
										!Number(values.amount) ||
										!values.asset1 ||
										balance.find(i => values.asset1 === i.display)!.amount <
											Number(values.amount) ||
										Object.values(isValidate).includes(false)
									}
								/>
							</div>
						</div>
					</div>
				</div>
			) : (
				<p className='h1 mt-[300px] text-center'>
					Connect to Penumbra if you want to have access to dApp
				</p>
			)}
		</>
	)
}
