import { Copy } from '@/components/Copy'
import { MemoView } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { bech32m } from 'bech32'
import React, { useMemo } from 'react'
import { AddressComponent } from './penumbra/Address'
import { ActionCell } from './ActionCell'

type MemoViewComponentProps = { memoView: MemoView }

export const MemoViewComponent: React.FC<MemoViewComponentProps> = ({
	memoView,
}) => {
	const { memoText, memoSender, memoReturnAddress } = useMemo(() => {
		let memoText = 'Encrypted'
		let memoSender = 'Encrypted'
		let memoReturnAddress

		if (memoView.memoView?.case == 'visible') {
			const plaintext = memoView.memoView.value.plaintext
			memoText = plaintext!.text
			memoSender = bech32m.encode(
				'penumbrav2t',
				bech32m.toWords(plaintext!.sender!.inner),
				160
			)
			// https://github.com/penumbra-zone/penumbra/issues/2782
			memoReturnAddress = plaintext!.sender
		}

		return {
			memoText,
			memoSender,
			memoReturnAddress,
		}
	}, [memoView])

	return (
		<div className='flex flex-col p-[16px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
			{memoText === 'Encrypted' ? (
				<ActionCell title='Sender Address'>
					<Copy text={memoSender} type='last' />
				</ActionCell>
			) : (
				<ActionCell title='Message'>{memoText}</ActionCell>
			)}
			<ActionCell
				title='Return Address'
				isEncrypted={memoSender === 'Encrypted'}
			>
				<AddressComponent address={memoReturnAddress!} />
			</ActionCell>
		</div>
	)
}
