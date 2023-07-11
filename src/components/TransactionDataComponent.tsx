import { calculateAmount } from '@/lib/calculateAmount'
import { TransactionBodyView } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import React, { useMemo } from 'react'

type TransactionDataComponentProps = {
	bodyView: TransactionBodyView
}

export const TransactionDataComponent: React.FC<
	TransactionDataComponentProps
> = ({ bodyView }) => {
	const { chainId, feeText, expiryText } = useMemo(() => {
		const chainId = bodyView?.chainId

		const feeAmountValue = bodyView?.fee?.amount

		const feeAmount = calculateAmount(
			Number(feeAmountValue!.lo),
			Number(feeAmountValue!.hi)
		)

		const feeText = `${feeAmount} upenumbra`

		const expiryText =
			String(bodyView?.expiryHeight) !== '0'
				? `${bodyView?.expiryHeight}`
				: 'None'

		return { chainId, feeText, expiryText }
	}, [bodyView])

	return (
		<div className='flex flex-col p-[16px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
			<div className='w-[100%] flex flex-col'>
				<p className='h3 mb-[8px] capitalize'>Chain ID</p>
				<p className='py-[8px] px-[16px] bg-dark_grey rounded-[10px] text_numbers_s text-light_grey break-words min-h-[44px] flex items-center'>
					{chainId}
				</p>
			</div>
			<div className='w-[100%] flex flex-col'>
				<p className='h3 mb-[8px] capitalize'>Fee</p>
				<p className='py-[8px] px-[16px] bg-dark_grey rounded-[10px] text_numbers_s text-light_grey break-words min-h-[44px] flex items-center'>
					{feeText}
				</p>
			</div>
			<div className='w-[100%] flex flex-col'>
				<p className='h3 mb-[8px] capitalize'>Expiry Height</p>
				<p className='py-[8px] px-[16px] bg-dark_grey rounded-[10px] text_numbers_s text-light_grey break-words min-h-[44px] flex items-center'>
					{expiryText}
				</p>
			</div>
		</div>
	)
}
