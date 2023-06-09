import { ArrowUpRightSvg, ChevronLeftIcon } from '../Svg'
import { useEffect, useState } from 'react'
import {
	TransactionInfoRequest,
	TransactionInfoResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { uint8ToBase64 } from '../../utils/uint8ToBase64'
import { TxDetailModal } from '../modals/TxDetailModal'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { createWebExtTransport } from '../../utils/webExtTransport'
import { getTransactionType } from '../../utils/transactionType'

export const ActivityList = () => {
	const [transactions, setTransactions] = useState<TransactionInfoResponse[]>(
		[]
	)
	const [selectedTx, setSelectedTx] = useState<
		undefined | TransactionInfoResponse
	>()

	useEffect(() => {
		const getTxs = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				createWebExtTransport(ViewProtocolService)
			)

			const txsRequest = new TransactionInfoRequest({})

			for await (const tx of client.transactionInfo(txsRequest)) {
				setTransactions(state => [tx, ...state])
			}
		}
		getTxs()
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
								className='px-[18px] py-[12px] border-y-[1px] border-solid border-dark_grey ext:mb-[8px] tablet:mb-[16px flex justify-between items-center'
							>
								<div className='flex items-center w-[100%]'>
									<ArrowUpRightSvg />
									<div className='flex flex-col ml-[14px]'>
										<p className='h3 w-[80px] mb-[8px]'>
											{getTransactionType(i.txInfo?.view)}
										</p>
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
								<div
									className='rotate-180 cursor-pointer'
									onClick={handleSelect(i)}
								>
									<ChevronLeftIcon />
								</div>
							</div>
						)
					})}
				</div>
			</div>
			{selectedTx && (
				<TxDetailModal
					show={Boolean(selectedTx)}
					onClose={handleSelect()}
					transaction={selectedTx}
				/>
			)}
		</>
	)
}
