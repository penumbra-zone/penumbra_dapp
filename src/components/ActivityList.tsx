"use client"

import { useTransactions } from '@/context'
import { ArrowUpRightSvg, ChevronLeftIcon } from './Svg'
import Link from 'next/link'
import { TransactionHashComponent } from './penumbra/TransactionHash'
import { getTransactionType, routesPath, uint8ToBase64 } from '@/lib'

export const ActivityList = () => {
	const { transactions } = useTransactions()

	return (
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
									<p className='text_body text-green'>Height</p>
									<p className='text_body text-green'>
										{String(i.txInfo?.height)}
									</p>
								</div>
								<div className='text_body ml-[14px]'>
									<TransactionHashComponent
										hash={uint8ToBase64(i.txInfo?.id?.hash!)}
									/>
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
		</div>
	)
}
