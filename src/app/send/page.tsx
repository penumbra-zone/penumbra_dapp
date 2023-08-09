'use client'

import {
	AddressByIndexRequest,
	EphemeralAddressRequest,
	TransactionPlannerRequest,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useEffect, useMemo, useState } from 'react'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { useRouter } from 'next/navigation'
import { bech32m } from 'bech32'
import { useAuth, useBalance } from '@/context'
import {
	AddressValidatorsType,
	routesPath,
	setOnlyNumberInput,
	validateAddress,
	extensionTransport,
} from '@/lib'
import { Button, ChevronLeftIcon, Input, SearchSvg, Select } from '@/components'

export default function Send() {
	const { balance } = useBalance()
	const auth = useAuth()
	const { push } = useRouter()

	const [reciever, setReciever] = useState<string>('')
	const [amount, setAmount] = useState<string>('')
	const [memo, setMemo] = useState<string>('')
	const [select, setSelect] = useState<string>('')
	const [isValidate, setIsValidate] = useState<AddressValidatorsType>(
		{} as AddressValidatorsType
	)

	useEffect(() => {
		if (!auth.walletAddress) {
			setAmount('')
			setReciever('')
			setSelect('')
			setIsValidate({} as AddressValidatorsType)
		}
	}, [auth.walletAddress])

	const options = useMemo(() => {
		if (!balance.length) return []
		return balance.map(i => {
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

	const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setReciever(event.target.value)
		const validators = validateAddress(event.target.value)
		setIsValidate(state => ({
			...state,
			...validators,
		}))
		if (!event.target.value) setIsValidate({} as AddressValidatorsType)
	}

	const handleChangeSelect = (value: string) => setSelect(value)

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
				Number(select ? balance.find(i => i.display === select)?.amount : 0)
			)
		)

	const getTransactionPlan = async () => {
		try {
			const selectedAsset = balance.find(i => i.display === select)?.assetId
				?.inner!

			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)

			const request1 = new EphemeralAddressRequest({
				addressIndex: {
					account: 0,
				},
			})
            console.log(request1);
            

			const ephemeralAddress = await client.ephemeralAddress(request1)
			console.log({ ephemeralAddress })

			// TODO If the user chose to hide the sender's address, we should get ephemeral address instead of addressByIndex
			const request = new AddressByIndexRequest({
				addressIndex: {
					account: 0,
				},
			})
			const { address } = await client.addressByIndex(request)

			const transactionPlan = (
				await client.transactionPlanner(
					new TransactionPlannerRequest({
						memo: {
							text: memo,
							sender: {
								altBech32m: address?.altBech32m,
							},
						},
						outputs: [
							{
								value: {
									amount: {
										lo: BigInt(
											Number(amount) *
												(balance.find(i => i.display === select)?.exponent!
													? 10 **
													  balance.find(i => i.display === select)?.exponent!
													: 1)
										),
										hi: BigInt(0),
									},
									assetId: { inner: selectedAsset },
								},
								address: {
									inner: new Uint8Array(bech32m.decode(reciever, 160).words),
									altBech32m: reciever,
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
			console.log(error)
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
						<p className='h1 mt-[24px]'>Send to address</p>
						<Input
							placeholder='Search address...'
							value={reciever}
							isError={Object.values(isValidate).includes(false)}
							onChange={handleChangeSearch}
							leftSvg={
								<span className='ml-[24px] mr-[9px]'>
									<SearchSvg stroke='#E0E0E0' />
								</span>
							}
							helperText='Invalid recipient address'
							className='w-[100%]'
						/>
						<div className='bg-brown rounded-[10px] w-[100%] flex flex-col justify-between p-[16px]'>
							<div className='flex flex-col'>
								<Select
									labelClassName='h3 mb-[8px]'
									label='Assets :'
									options={options}
									handleChange={handleChangeSelect}
									initialValue={select}
									className='mb-[24px]'
								/>
								<Input
									labelClassName='h3 text-light_grey mb-[8px]'
									label='Total :'
									value={amount}
									isError={
										select
											? balance.find(i => select === i.display)!.amount <
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
								<Input
									labelClassName='h3 text-light_grey mb-[8px]'
									label='Memo :'
									value={memo}
									onChange={handleChangeMemo}
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
									onClick={getTransactionPlan}
									title='Send'
									className='h-[44px]'
									disabled={
										!Number(amount) ||
										!select ||
										balance.find(i => select === i.display)!.amount <
											Number(amount) ||
										!reciever ||
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
