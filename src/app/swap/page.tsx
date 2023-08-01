'use client'

import { TransactionPlannerRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useEffect, useMemo, useState } from 'react'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { useRouter } from 'next/navigation'
import { useAuth, useBalance } from '@/context'
import {
	AddressValidatorsType,
	routesPath,
	setOnlyNumberInput,
	extensionTransport,
} from '@/lib'
import { Button, ChevronLeftIcon, Input, Select } from '@/components'

export default function Swap() {
	const { balance } = useBalance()
	const auth = useAuth()
	const { push } = useRouter()
	const [amount, setAmount] = useState<string>('')
	const [memo, setMemo] = useState<string>('')
	const [select, setSelect] = useState<{
		asset1: string
		asset2: string
	}>({
		asset1: '',
		asset2: 'penumbra',
	})
	const [isValidate, setIsValidate] = useState<AddressValidatorsType>(
		{} as AddressValidatorsType
	)

	useEffect(() => {
		if (!auth.walletAddress) {
			setAmount('')
			setSelect({
				asset1: '',
				asset2: 'penumbra',
			})
			setIsValidate({} as AddressValidatorsType)
		}
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

	const handleChangeSelect = (type: string) => (value: string) =>
		setSelect(state => ({
			...state,
			[type]: value,
		}))

	const handleChangeAmout = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value, notShow, valueFloat } = setOnlyNumberInput(
			event.target.value
		)
		if (isNaN(valueFloat) || notShow) return
		setAmount(value)
	}

	const handleChangeMemo = (event: React.ChangeEvent<HTMLInputElement>) =>
		setMemo(event.target.value)

	const handleMax = () =>
		setAmount(
			String(
				Number(
					select.asset1 ? balance.find(i => i.display === select.asset1)?.amount : 0
				)
			)
		)

	const getSwapTransactionPlan = async () => {
		try {
			const selectedAsset1 = balance.find(i => i.display === select.asset1)
				?.assetId?.inner!

			const selectedAsset2 = balance.find(i => i.display === select.asset2)
				?.assetId?.inner!

			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)

			const transactionPlan = (
				await client.transactionPlanner(
					new TransactionPlannerRequest({
						memo,
						swaps: [
							{
								value: {
									amount: {
										lo: BigInt(
											Number(amount) *
												(balance.find(i => i.display === select.asset1)
													?.exponent!
													? 10 **
													  balance.find(i => i.display === select.asset1)
															?.exponent!
													: 1)
										),
										hi: BigInt(0),
									},
									assetId: { inner: selectedAsset1 },
								},
								targetAsset: {
									inner: selectedAsset2,
								},
								fee: {
									amount: {
										hi: BigInt(0),
										lo: BigInt(0),
									},
								},
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
			console.error(error)
		}
	}

	const handleBack = () => push(routesPath.HOME)

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
							<div className='flex flex-col gap-y-[16px]'>
								<Select
									labelClassName='h3'
									label='Assets 1:'
									options={options1}
									handleChange={handleChangeSelect('asset1')}
									initialValue={select.asset1}
								/>
								<Input
									labelClassName='h3 text-light_grey'
									label='Total :'
									value={amount}
									isError={
										select.asset1
											? balance.find(i => select.asset1 === i.display)!.amount <
											  Number(amount)
											: false
									}
									onChange={handleChangeAmout}
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
									labelClassName='h3'
									label='Assets 2:'
									options={options2}
									handleChange={handleChangeSelect('asset2')}
									initialValue={select.asset2}
									disable
								/>
								<Input
									labelClassName='h3 text-light_grey'
									label='Memo :'
									value={memo}
									onChange={handleChangeMemo}
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
									onClick={getSwapTransactionPlan}
									title='Send'
									className='h-[44px]'
									disabled={
										!Number(amount) ||
										!select.asset1 ||
										balance.find(i => select.asset1 === i.display)!.amount <
											Number(amount) ||
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
