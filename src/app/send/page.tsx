'use client'

import {
	Button,
	ChevronLeftIcon,
	Input,
	SearchSvg,
	Select,
	Toogle,
} from '@/components'
import { useAuth, useBalance } from '@/context'
import { useTransactionValues } from '@/hooks'
import { createViewServiceClient, routesPath } from '@/lib'
import { Address } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import {
	AddressByIndexRequest,
	EphemeralAddressRequest,
	TransactionPlannerRequest,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { bech32m } from 'bech32'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

export default function Send() {
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
		handleCheck,
	} = useTransactionValues()

	useEffect(() => {
		if (!auth.walletAddress) clearState()
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

	const handleBack = () => push(routesPath.HOME)

	const sendTransaction = async () => {
		try {
			const asset = balance.find(i => i.display === values.asset1)

			if (!asset || !values.reciever || !values.amount) return

			const assetExponent = asset.exponent

			const client = createViewServiceClient()

			let address: Address | undefined

			const addressIndex = {
				account: 0,
			}

			if (!values.hideAddress) {
				const request = new AddressByIndexRequest({
					addressIndex,
				})
				const addressByIndex = await client.addressByIndex(request)
				address = addressByIndex.address
			} else {
				const request = new EphemeralAddressRequest({
					addressIndex,
				})

				const ephemeralAddress = await client.ephemeralAddress(request)
				address = ephemeralAddress.address
			}

			if (!address) return

			const value = {
				amount: {
					lo: BigInt(
						Number(values.amount) * (assetExponent ? 10 ** assetExponent : 1)
					),
					hi: BigInt(0),
				},
				assetId: { inner: asset.assetId?.inner },
			}

			const receiverAddress = {
				altBech32m: values.reciever!,
				inner: new Uint8Array(bech32m.decode(values.reciever!, 160).words),
			}

			const memo = {
				text: values.memo,
				sender: {
					altBech32m: address?.altBech32m,
				},
			}

			const transactionPlan = (
				await client.transactionPlanner(
					new TransactionPlannerRequest({
						memo,
						outputs: [
							{
								value,
								address: receiverAddress,
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
						<p className='h1 mt-[24px]'>Send to address</p>
						<Input
							placeholder='Search address...'
							value={values.reciever}
							isError={Object.values(isValidate).includes(false)}
							onChange={handleChangeInput('reciever')}
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
									handleChange={handleChangeSelect('asset1')}
									initialValue={values.asset1}
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
								<Input
									labelClassName='h3 text-light_grey mb-[8px]'
									label='Memo :'
									value={values.memo}
									onChange={handleChangeInput('memo')}
									className='mb-[24px]'
								/>
								<Toogle
									checked={Boolean(values.hideAddress)}
									label='Hide Sender from Recipient'
									onChange={handleCheck}
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
										!values.reciever ||
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
