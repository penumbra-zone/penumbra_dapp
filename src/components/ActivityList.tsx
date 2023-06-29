import { useTransactions } from '@/context/TransactionContext'
import { uint8ToBase64 } from '@/lib/uint8ToBase64'
import { ArrowUpRightSvg, ChevronLeftIcon } from './Svg'
import { getTransactionType } from '@/lib/transactionType'
import Link from 'next/link'
import { routesPath } from '@/lib/constants'

export const ActivityList = () => {
	const { transactions } = useTransactions()

	return (
		<div className='flex flex-col mt-[24px] min-h-[120px]'>
			{transactions.map(i => {
				return (
					<div
						key={Number(i.txInfo?.height)}
						className='px-[12px] py-[16px] border-b-[1px] border-solid border-dark_grey flex justify-between items-center'
					>
						<div className='flex items-center gap-x-[8px]'>
							<span className='w-[16px] h-[16px]'>
								<ArrowUpRightSvg width='16' height='16' />
							</span>
							<div className='flex flex-col'>
								<p className='h3'>{getTransactionType(i.txInfo?.view)}</p>
								<div className='flex gap-x-[8px]'>
									<p className='text_body text-green'>
										Block height : {String(i.txInfo?.height)}
									</p>
									<p className='text_body break-all'>
										Hash : {uint8ToBase64(i.txInfo?.id?.hash!)}
									</p>
								</div>
							</div>
						</div>
						<Link
							href={`${routesPath.TRANSACTION}?hash=${uint8ToBase64(
								i.txInfo?.id?.hash!
							)}`}
							className='rotate-180 cursor-pointer'
						>
							<ChevronLeftIcon />
						</Link>
					</div>
				)
			})}
		</div>
	)
}
