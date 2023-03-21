import { NotesResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useState } from 'react'
import { UserData } from '../../Signer/types'
import { Input } from '../Input'
import { Button } from '../Tab/Button'
import * as wasm from 'penumbra-web-assembly'

const uint8ToBase64 = (arr: Uint8Array): string =>
	btoa(
		Array(arr.length)
			.fill('')
			.map((_, i) => String.fromCharCode(arr[i]))
			.join('')
	)

type SendTxProps = {
	userData: UserData & { fvk: string }
	notes: NotesResponse[]
}

export const SendTx: React.FC<SendTxProps> = ({ userData, notes }) => {
	const [values, setValues] = useState<{
		reciever: string
		amount: string
		assetId: string
	}>({
		reciever:
			'penumbrav2t1fk9vamrkyskeysrlggyj2444axrdtck90cvysqg5ksmrh8r228mspwfflrw35unrhsncvwxr68f52gagrwfwp4gg9u0wmzarw8crxzyh5zhru048q8q4uemsl74c8vpasacufd',
		amount: '',
		assetId: 'KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA=',
	})

	const onChange =
		(type: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
			setValues(state => ({ ...state, [type]: event.target.value }))

	const getTransactionPlan = async () => {
		const fvk = userData!.fvk

		if (!fvk) return
		const filteredNotes = notes
			.filter(
				note =>
					!note.noteRecord?.heightSpent &&
					uint8ToBase64(note.noteRecord?.note?.value?.assetId?.inner!) ===
						values.assetId
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
				lo: Number(values.amount) * 1000000,
				hi: 0,
			},
			assetId: { inner: values.assetId },
		}

		const transactionPlan = await wasm.send_plan(
			fvk,
			valueJs,
			values.reciever,
			viewServiceData
		)

		await window.penumbra.signTransaction(transactionPlan)
	}
	return (
		<div>
			<Input
				label='Address :'
				placeholder='Search, address...'
				value={values.reciever}
				onChange={onChange('reciever')}
				className='w-[100%]'
			/>
			<Input
				labelClassName='h3 text-light_grey mb-[16px]'
				placeholder='Amount'
				label='Amount :'
				value={values.amount}
				onChange={onChange('amount')}
				className='mt-[24px]'
			/>
			<Button
				mode='gradient'
				title='Send tx'
				className='w-[200px] mt-[24px]'
				onClick={getTransactionPlan}
			/>
		</div>
	)
}
