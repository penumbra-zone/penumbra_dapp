import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../components/Input'
import { SelectInput } from '../../components/Select'
import { CloseSvg, SearchSvg } from '../../components/Svg'
import { Button } from '../../components/Tab/Button'
import { routesPath } from '../../utils/constants'
import { setOnlyNumberInput } from '../../utils/setOnlyNumberInput'
import {
	AddressValidatorsType,
	validateAddress,
} from '../../utils/validate/validateAddress'
import {
	NotesRequest,
	NotesResponse, TransactionPlannerRequest,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useBalance } from '../../context'
import { uint8ToBase64 } from '../../utils/uint8ToBase64'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { createWebExtTransport } from '../../utils/webExtTransport'
import { useAuth } from '../../App'

let { bech32, bech32m } = require('bech32')


export const SendTx = () => {
	const { balance } = useBalance()
	const auth = useAuth()
	const navigate = useNavigate()
	const [reciever, setReciever] = useState<string>(
		''
		// 'penumbrav2t156t9s3s0786ghjnpk20jjaweqyeavfevpd7rkjycllu5qtevuuy69j948fy6gpgwptl2mgcgl0u5mw8glk38puggxx290cryz6pvxde3vgv4tuuey4rlrpf2smes5wt2m957r9'
	)
	const [amount, setAmount] = useState<string>('')
	const [select, setSelect] = useState<string>('')
	const [isValidate, setIsValidate] = useState<AddressValidatorsType>(
		{} as AddressValidatorsType
	)
	const [notes, setNotes] = useState<NotesResponse[]>([])

	useEffect(() => {
		const getNotes = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				createWebExtTransport(ViewProtocolService)
			)

			const notesRequest = new NotesRequest({})

			for await (const note of client.notes(notesRequest)) {
				setNotes(state => [...state, note])
			}
		}
		getNotes()
	}, [])

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

	const handleBack = () => navigate(routesPath.HOME)

	const handleMax = () =>
		setAmount(
			String(
				Number(select ? balance.find(i => i.display === select)?.amount : 0)
			)
		)

	const getTransactionPlan = async () => {
		try {

			const selectedAsset =
				balance.find(i => i.display === select)?.asset?.inner!


			const client = createPromiseClient(
				ViewProtocolService,
				createWebExtTransport(ViewProtocolService)
			)

			console.log(bech32m.decode(reciever, 160));

			const transactionPlan = (await client.transactionPlanner(new TransactionPlannerRequest({
				outputs: [
					{
						value: {
							amount: {
								lo: BigInt(
									Number(amount) *
									(balance.find(i => i.display === select)?.exponent!
										? 10 ** balance.find(i => i.display === select)?.exponent!
										: 1)),
								hi: BigInt(0),
							},
							assetId: { inner: selectedAsset }
						},
						address: {
							inner: new Uint8Array(bech32m.decode(reciever, 160).words),
							altBech32m: reciever
						}
					}
				]
			}))).plan

			const tx = await window.penumbra.signTransaction(transactionPlan)

			if (tx.result.code === 0) {
				navigate(routesPath.HOME, { state: { tab: 'Activity' } })
			} else {
				console.log(tx.result)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<>
			{auth.walletAddress ? (
				<div className='w-[100%]  flex flex-col items-center justify-center ext:py-[40px] tablet:py-[0px] tablet:mb-[20px]'>
					<div className='w-[400px]'>
						<div className='w-[100%]  flex flex-col items-center justify-center ext:py-[40px] tablet:py-[0px] tablet:mb-[20px]'>
							<div className='w-[100%] flex justify-center items-center mb-[8px]'>
								<p className='h1 ml-[auto]'>Send to address</p>
								<span
									className='ml-[auto] svg_hover cursor-pointer'
									onClick={handleBack}
									role='button'
									tabIndex={0}
								>
									<CloseSvg width='24' height='24' fill='#E0E0E0' />
								</span>
							</div>
							<Input
								placeholder='Search, address...'
								value={reciever}
								isError={Object.values(isValidate).includes(false)}
								onChange={handleChangeSearch}
								leftSvg={
									<span className='ml-[24px] mr-[9px]'>
										<SearchSvg />
									</span>
								}
								helperText='Invalid recipient address'
								className='w-[100%]'
							/>
							<div className='bg-brown rounded-[15px] w-[100%]'>
								<div className='h-[100%] flex flex-col justify-between px-[16px] py-[24px]'>
									<div className='flex flex-col'>
										<SelectInput
											labelClassName='h3 text-light_grey mb-[16px]'
											label='Assets :'
											options={options}
											handleChange={handleChangeSelect}
											initialValue={select}
										/>
										<Input
											labelClassName='h3 text-light_grey mb-[16px]'
											label='Total :'
											value={amount}
											isError={
												select
													? balance.find(i => select === i.display)!.amount <
													  Number(amount)
													: false
											}
											onChange={handleChangeAmout}
											className='mt-[24px]'
											helperText={'You do not have enough token'}
											rightElement={
												<div
													className='flex items-center bg-dark_grey h-[50px] px-[25px] rounded-r-[15px] text_button_ext cursor-pointer'
													onClick={handleMax}
												>
													Max
												</div>
											}
										/>
									</div>
									<div className='w-[100%] flex pt-[8px]'>
										<Button
											mode='transparent'
											onClick={handleBack}
											title='Cancel'
											className='ext:pt-[7px] tablet:pt-[7px] ext:pb-[7px] tablet:pb-[7px] w-[50%] mr-[8px]'
										/>
										<Button
											mode='gradient'
											onClick={getTransactionPlan}
											title='Send'
											className='ext:pt-[7px] tablet:pt-[7px] ext:pb-[7px] tablet:pb-[7px] w-[50%] ml-[8px]'
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
