import { ArrowUpRightSvg, ChevronLeftIcon } from '../Svg'
import { useEffect, useState } from 'react'
import { TransactionInfoResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { uint8ToBase64 } from '../../utils/uint8ToBase64'

export const ActivityList = () => {
	const [transactions, setTransactions] = useState<TransactionInfoResponse[]>(
		[]
	)
	useEffect(() => {
		window.penumbra.on('transactions', tx => {
			setTransactions(state => [...state, tx])
		})
	}, [])

	return (
		<div className='w-[100%] flex flex-col items-center'>
			<div className='w-[100%] flex flex-col ext:mb-[32px] tablet:mb-[8px]'>
				{transactions.map((i, index) => {
					return (
						<div
							key={Number(i.txInfo?.height)}
							className='px-[18px] py-[12px] border-y-[1px] border-solid border-dark_grey ext:mb-[8px] tablet:mb-[16px flex justify-between items-center'
						>
							<div className='flex items-center'>
								<ArrowUpRightSvg />
								<div className='flex flex-col ml-[16px]'>
									<p className='h3 mb-[6px]'>Send</p>
									<p className='text_body text-green'>
										Block height : {String(i.txInfo?.height)}{' '}
									</p>
								</div>
								<p className='text_body ml-[16px]'>Hash: </p>
								<p className='text_body ml-[8px] break-words w-[300px]'>
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
	)
}
