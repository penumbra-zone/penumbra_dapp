import { calculateAmount } from '@/lib/calculateAmount'
import { TransactionBodyView } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import React, { useMemo } from 'react'
import { ActionCell } from './ActionCell'

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
			<ActionCell title='Chain ID'>{chainId}</ActionCell>
			<ActionCell title='Fee'>{feeText}</ActionCell>
			<ActionCell title='Expiry Height'>{expiryText}</ActionCell>
		</div>
	)
}
