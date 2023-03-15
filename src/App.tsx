import { useEffect, useState } from 'react'
import { Assets } from './components/ViewService/Assets'
import { ChainParameters } from './components/ViewService/ChainParameters'
import { Tabs } from './components/Tab'
import { Descriptions } from './components/Descriptions'
import img from './assets/img/logo.png'
import { Status } from './components/ViewService/Status'
import { Notes } from './components/ViewService/Notes'
import { TransactionHashes } from './components/ViewService/TransactionHashes'
import { Transactions } from './components/ViewService/Transactions'
import { TransactionByHash } from './components/ViewService/TransactionByHash'
import { NoteByCommitment } from './components/ViewService/NoteByCommitment'
import { isPenumbraInstalled, ProviderPenumbra } from './utils/ProviderPenumbra'
import { Button } from './components/Tab/Button'
import { UserData } from './Signer/types'
import { FmdParameters } from './components/ViewService/FmdParameters'
import { StatusStream } from './components/ViewService/StatusStream'
import {
	BalanceByAddressResponse,
	NotesResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'

import * as wasm from 'penumbra-web-assembly'

export const getShortKey = (text: string) => {
	if (!text) return ''
	return text.slice(0, 10) + '..' + text.slice(-9)
}

const uint8ToBase64 = (arr: Uint8Array): string =>
	btoa(
		Array(arr.length)
			.fill('')
			.map((_, i) => String.fromCharCode(arr[i]))
			.join('')
	)
function App() {
	const [isPenumbra, setIsPenumbra] = useState<boolean>(false)
	const [userData, setUserData] = useState<null | (UserData & { fvk: string })>(
		null
	)
	const [balance, setBalance] = useState<BalanceByAddressResponse[]>([])
	const [notes, setNotes] = useState<NotesResponse[]>([])

	const penumbra = new ProviderPenumbra()

	const checkIsPenumbraInstalled = async () => {
		const isInstalled = await isPenumbraInstalled()
		setIsPenumbra(isInstalled)
	}

	useEffect(() => {
		checkIsPenumbraInstalled()
	}, [])

	const handleConnect = async () => {
		const data = await penumbra.login()

		setUserData(data)
	}

	useEffect(() => {
		if (!isPenumbra) return

		window.penumbra.on('balance', balance => {
			setBalance(state => [...state, balance])
		})
	}, [isPenumbra])

	useEffect(() => {
		if (!isPenumbra) return

		window.penumbra.on('balance', balance => {
			console.log({ balance })
		})
		window.penumbra.on('assets', asset => {
			console.log({ asset })
		})
		window.penumbra.on('status', status => {
			console.log({ status })
		})
		window.penumbra.on('notes', note => {
			setNotes(state => [...state, note])
			console.log({ note })
		})
		window.penumbra.on('state', state => {
			setUserData(state.account)
		})
	}, [isPenumbra])

	const getTransactionPlan = async (
		destAddress = 'penumbrav2t1fk9vamrkyskeysrlggyj2444axrdtck90cvysqg5ksmrh8r228mspwfflrw35unrhsncvwxr68f52gagrwfwp4gg9u0wmzarw8crxzyh5zhru048q8q4uemsl74c8vpasacufd',
		amount = 1,
		assetId = 'KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA='
	) => {
		const fvk = userData!.fvk
		if (!fvk) return
		console.log({ fvk })
		console.log({ notes })
		const filteredNotes = notes.filter(
			note =>
				!note.noteRecord?.heightSpent &&
				uint8ToBase64(note.noteRecord?.note?.value?.assetId?.inner!) === assetId
		)
		console.log({ filteredNotes })
		if (!filteredNotes.length) console.error('No notes found to spend')

		const fmdParameters = (await window.penumbra.getFmdParameters()).parameters
		console.log({ fmdParameters })
		if (!fmdParameters) console.error('No found FmdParameters')

		const chainParameters = (await window.penumbra.getChainParameters())
			.parameters
		console.log({ chainParameters })
		if (!chainParameters) console.error('No found chain parameters')

		const viewServiceData = {
			notes,
			chain_parameters: chainParameters,
			fmd_parameters: fmdParameters,
		}
		console.log({ viewServiceData })

		const valueJs = {
			amount: {
				lo: amount * 1000000,
				hi: '0n',
			},
			assetId,
		}

		const transactionPlan = wasm.send_plan(
			fvk,
			valueJs,
			destAddress,
			viewServiceData
		)
		console.log({transactionPlan});
	}

	return (
		<div className='flex item-center justify-center mx-[104px]'>
			{!isPenumbra ? (
				<p className='h1 mt-[300px]'>Install Penumbra</p>
			) : (
				<div className='w-[100%] flex flex-col'>
					<div className='w-[100%] flex justify-between items-center'>
						<img
							src={img}
							alt='penumbra log'
							className='w-[192px] object-cover cursor-pointer'
						/>
						{userData ? (
							<div>
								<p className='h3'>{getShortKey(userData.addressByIndex)}</p>

								{balance.map((i, index) => {
									i.amount?.lo.toString()
									return (
										<div key={index}>
											Balance - {Number(i.amount?.lo.toString()) / 10 ** 6}
										</div>
									)
								})}
								<Button
									mode='gradient'
									title='Send tx'
									className='w-[200px]'
									onClick={getTransactionPlan}
								/>
							</div>
						) : (
							<Button
								mode='gradient'
								title='Connect'
								className='w-[200px]'
								onClick={handleConnect}
							/>
						)}
					</div>
					{userData ? (
						<>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Get current status of chain sync'
												type='Status'
												requestFields={[
													{
														type: 'penumbra.core.crypto.v1alpha1.AccountID account_id = 1;',
														desc: '// Identifies the FVK for the notes to query.',
													},
												]}
												responseFields={[
													{
														type: 'uint64 sync_height = 1;',
														desc: '// The height the view service has synchronized to so far',
													},
													{
														type: 'bool catching_up = 2;',
														desc: '// Whether the view service is catching up with the chain state',
													},
												]}
											/>
										) : (
											<Status />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Stream sync status updates until the view service has caught up with the core.chain.v1alpha1'
												type='StatusStream'
												requestFields={[
													{
														type: 'penumbra.core.crypto.v1alpha1.AccountID account_id = 1;',
														desc: '// Identifies the FVK for the notes to query.',
													},
												]}
												responseFields={[
													{
														type: 'uint64 sync_height = 1;',
														desc: '// The height the view service has synchronized to so far',
													},
													{
														type: 'bool catching_up = 2;',
														desc: '// Whether the view service is catching up with the chain state',
													},
												]}
											/>
										) : (
											<StatusStream />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Queries for notes that have been accepted by the core.chain.v1alpha1.'
												type='Notes'
												requestFields={[
													{
														type: 'penumbra.core.crypto.v1alpha1.AccountID account_id = 1;',
														desc: '// Identifies the FVK for the notes to query.',
													},
													{
														type: 'bool include_spent = 2;',
														desc: '// If set, return spent notes as well as unspent notes.',
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.AssetId asset_id = 3;',
														desc: '// If set, only return notes with the specified asset id.',
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.AddressIndex address_index = 4;',
														desc: '// If set, only return notes with the specified address incore.dex.v1alpha1.',
													},
													{
														type: 'uint64 amount_to_spend = 5;',
														desc: '// If set, stop returning notes once the total exceeds this amount. gnored if `asset_id` is unset or if `include_spent` is set.',
													},
												]}
												responseFields={[
													{
														type: '	penumbra.core.crypto.v1alpha1.NoteCommitment note_commitment = 1;',
														desc: '// The note commitment, identifying the note.',
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.Note note = 2;',
														desc: '// The note plaintext itself.',
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.AddressIndex address_index = 3;',
														desc: "// A precomputed decryption of the note's address incore.dex.v1alpha1.",
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.Nullifier nullifier = 4;',
														desc: "// The note's nullifier.",
													},
													{
														type: 'uint64 height_created = 5;',
														desc: '// The height at which the note was created.',
													},
													{
														type: 'optional uint64 height_spent = 6;',
														desc: '// Records whether the note was spent (and if so, at what height).',
													},
													{
														type: 'uint64 position = 7;',
														desc: '// The note position.',
													},
													{
														type: 'penumbra.core.chain.v1alpha1.NoteSource source = 8;',
														desc: '// The source of the note (a tx hash or otherwise)',
													},
												]}
											/>
										) : (
											<Notes />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Query for a note by its note commitment, optionally waiting until the note is detected.'
												type='NoteByCommitment'
												requestFields={[
													{
														type: 'penumbra.core.crypto.v1alpha1.AccountID account_id = 1;',
														desc: '// Identifies the FVK for the notes to query.',
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.NoteCommitment note_commitment = 2;',
														desc: '',
													},
													{
														type: 'bool await_detection = 3;',
														desc: '// If set to true, waits to return until the requested note is detected.',
													},
												]}
												responseFields={[
													{
														type: '	penumbra.core.crypto.v1alpha1.NoteCommitment note_commitment = 1;',
														desc: '// The note commitment, identifying the note.',
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.Note note = 2;',
														desc: '// The note plaintext itself.',
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.AddressIndex address_index = 3;',
														desc: "// A precomputed decryption of the note's address incore.dex.v1alpha1.",
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.Nullifier nullifier = 4;',
														desc: "// The note's nullifier.",
													},
													{
														type: 'uint64 height_created = 5;',
														desc: '// The height at which the note was created.',
													},
													{
														type: 'optional uint64 height_spent = 6;',
														desc: '// Records whether the note was spent (and if so, at what height).',
													},
													{
														type: 'uint64 position = 7;',
														desc: '// The note position.',
													},
													{
														type: 'penumbra.core.chain.v1alpha1.NoteSource source = 8;',
														desc: '// The source of the note (a tx hash or otherwise)',
													},
												]}
											/>
										) : (
											<NoteByCommitment />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Queries for assets.'
												type='Assets'
												requestFields={[
													{
														type: '',
														desc: '//  This message has no fields.',
													},
												]}
												responseFields={[
													{
														type: 'penumbra.core.crypto.v1alpha1.Asset asset = 1;',
														desc: '',
													},
												]}
											/>
										) : (
											<Assets />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Query for the current chain parameters.'
												type='ChainParameters'
												requestFields={[
													{
														type: '',
														desc: '//  This message has no fields.',
													},
												]}
												responseFields={[
													{
														type: 'penumbra.core.chain.v1alpha1.ChainParameters parameters = 1;',
														desc: '',
													},
												]}
											/>
										) : (
											<ChainParameters />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Query for the current chain parameters.'
												type='FMDParameters'
												requestFields={[
													{
														type: '',
														desc: '//  This message has no fields.',
													},
												]}
												responseFields={[
													{
														type: 'penumbra.core.chain.v1alpha1.FmdParameters parameters = 1',
														desc: '',
													},
												]}
											/>
										) : (
											<FmdParameters />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Query for the transaction hashes in the given range of blocks.'
												type='TransactionHashes'
												requestFields={[
													{
														type: 'optional uint64 start_height = 1;',
														desc: '// If present, return only transactions after this height.',
													},
													{
														type: 'optional uint64 end_height = 2;',
														desc: '// If present, return only transactions before this height.',
													},
												]}
												responseFields={[
													{
														type: 'uint64 block_height = 1;',
														desc: '',
													},
													{
														type: 'bytes tx_hash = 2;',
														desc: '',
													},
												]}
											/>
										) : (
											<TransactionHashes />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Query for the full transactions in the given range of blocks.'
												type='Transactions'
												requestFields={[
													{
														type: 'optional uint64 start_height = 1;',
														desc: '// If present, return only transactions after this height.',
													},
													{
														type: 'optional uint64 end_height = 2;',
														desc: '// If present, return only transactions before this height.',
													},
												]}
												responseFields={[
													{
														type: 'uint64 block_height = 1;',
														desc: '',
													},
													{
														type: 'bytes tx_hash = 2;',
														desc: '',
													},
													{
														type: 'penumbra.core.transaction.v1alpha1.Transaction tx = 3;',
														desc: '',
													},
												]}
											/>
										) : (
											<Transactions />
										)
									}
								/>
							</div>
							<div className='p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]'>
								<Tabs
									tabs={['Description', 'Request']}
									children={(type: string) =>
										type === 'Description' ? (
											<Descriptions
												desc='Query for a given transaction hash.'
												type='TransactionByHash'
												requestFields={[
													{
														type: 'bytes tx_hash = 1;',
														desc: '// The transaction hash to query for.',
													},
												]}
												responseFields={[
													{
														type: 'TransactionBody body = 1;',
														desc: '',
													},
													{
														type: 'bytes binding_sig = 2;',
														desc: '// The binding signature is stored separately from the transaction body that it signs.',
													},
													{
														type: 'penumbra.core.crypto.v1alpha1.MerkleRoot anchor = 3;',
														desc: '// The root of some previous state of the note commitment tree, used as an anchor for all ZK state transition proofs.',
													},
												]}
											/>
										) : (
											<TransactionByHash />
										)
									}
								/>
							</div>
						</>
					) : (
						<p className='h1 mt-[300px] text-center'>
							Connect to Penumbra if you want to have access to request
						</p>
					)}
				</div>
			)}
		</div>
	)
}

export default App
