import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../App'
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
import * as wasm from 'penumbra-wasm'
import {
	BalanceByAddressResponse,
	NotesResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'

export const uint8ToBase64 = (arr: Uint8Array): string =>
	btoa(
		Array(arr.length)
			.fill('')
			.map((_, i) => String.fromCharCode(arr[i]))
			.join('')
	)

export const SendTx = () => {
	let auth = useAuth()
	const navigate = useNavigate()
	const [reciever, setReciever] = useState<string>(
		'penumbrav2t1fk9vamrkyskeysrlggyj2444axrdtck90cvysqg5ksmrh8r228mspwfflrw35unrhsncvwxr68f52gagrwfwp4gg9u0wmzarw8crxzyh5zhru048q8q4uemsl74c8vpasacufd'
	)
	const [amount, setAmount] = useState<string>('')
	const [select, setSelect] = useState<string>('')
	const [isValidate, setIsValidate] = useState<AddressValidatorsType>(
		{} as AddressValidatorsType
	)
	const [balance, setBalance] = useState<
		Record<string, BalanceByAddressResponse>
	>({})
	const [notes, setNotes] = useState<NotesResponse[]>([])

	useEffect(() => {
		window.penumbra.on('notes', note => {
			setNotes(state => [...state, note])
		})
	}, [])

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

	const options = useMemo(() => {
		if (!Object.values(balance).length) return []
		return Object.entries(balance).map(i => {
			return {
				value: i[0],
				label: (
					<div className='flex flex-col'>
						<p className='text_numbers'>PNB</p>
						<div className='flex items-center'>
							<p className='text_body text-light_grey'>Balance:</p>
							<p className='text_numbers_s text-light_grey ml-[16px]'>
								{Number(Number(i[1].amount?.lo || 0) / 10 ** 6).toLocaleString(
									'en-US'
								)}{' '}
								PNB
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
		setAmount(String(Number(select ? balance[select].amount?.lo : 0) / 10 ** 6))

	const getTransactionPlan = async () => {
		const fvk = auth.user!.fvk

		if (!fvk) return
		const filteredNotes = notes
			.filter(
				note =>
					!note.noteRecord?.heightSpent &&
					uint8ToBase64(note.noteRecord?.note?.value?.assetId?.inner!) ===
						select
			)
			.map(i => i.noteRecord?.toJson())
		if (!filteredNotes.length) console.error('No notes found to spend')

		const fmdParameters = (await window.penumbra.getFmdParameters()).parameters

		if (!fmdParameters) console.error('No found FmdParameters')

		const chainParameters = (await window.penumbra.getChainParameters())
			.parameters
		if (!chainParameters) console.error('No found chain parameters')

		const viewServiceData = {
			notes: filteredNotes,
			chain_parameters: chainParameters,
			fmd_parameters: fmdParameters,
		}

		const valueJs = {
			amount: {
				lo: Number(amount) * 1000000,
				hi: 0,
			},
			assetId: { inner: select },
		}

		const transactionPlan = await wasm.send_plan(
			fvk,
			valueJs,
			reciever,
			viewServiceData
		)

		await window.penumbra.signTransaction(transactionPlan)
	}

	return (
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
											? Number(balance[select].amount?.lo) / 10 ** 6 <
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
										Number(balance[select].amount?.lo) / 10 ** 6 <
											Number(amount)
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
