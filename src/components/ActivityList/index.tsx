import { ArrowUpRightSvg, ChevronLeftIcon } from '../Svg'
import { useEffect, useState } from 'react'
import {
	NotesResponse,
	TransactionInfoResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { uint8ToBase64 } from '../../utils/uint8ToBase64'
import { TxDetailModal } from '../modals/TxDetailModal'

export const ActivityList = () => {
	const [transactions, setTransactions] = useState<TransactionInfoResponse[]>(
		[]
	)
	const [notes, setNotes] = useState<NotesResponse[]>([])
	const [selectedTx, setSelectedTx] = useState<
		undefined | TransactionInfoResponse
	>()

	useEffect(() => {
		window.penumbra.on('notes', note => {
			setNotes(state => [...state, note])
		})
	}, [])

	useEffect(() => {
		window.penumbra.on('transactions', tx => {
			setTransactions(state => [...state, tx])
		})
	}, [])

	const handleSelect = (tx?: TransactionInfoResponse) => () => setSelectedTx(tx)
	return (
		<>
			<div className='w-[100%] flex flex-col items-center'>
				<div className='w-[100%] flex flex-col ext:mb-[32px] tablet:mb-[8px]'>
					{transactions.map(i => {
						return (
							<div
								key={Number(i.txInfo?.height)}
								className='px-[18px] py-[12px] border-y-[1px] border-solid border-dark_grey ext:mb-[8px] tablet:mb-[16px flex justify-between items-center cursor-pointer'
								onClick={handleSelect(i)}
							>
								<div className='flex items-center w-[100%]'>
									<ArrowUpRightSvg />
									<div className='flex flex-col ml-[14px]'>
										<p className='h3 mb-[6px]'>Send</p>
										<p className='text_body text-green'>Block height :</p>
										<p className='text_body text-green'>
											{String(i.txInfo?.height)}
										</p>
									</div>
									<p className='text_body ml-[14px]'>Hash: </p>
									<p className='text_body ml-[14px] break-all'>
										{uint8ToBase64(i.txInfo?.id?.hash!)}
									</p>
								</div>
								<div className='rotate-180'>
									<ChevronLeftIcon />
								</div>
							</div>
						)
					})}
				</div>
			</div>
			{selectedTx && notes.length && (
				<TxDetailModal
					show={Boolean(selectedTx)}
					onClose={handleSelect()}
					transaction={selectedTx}
					notes={notes}
				/>
			)}
		</>
	)
}
