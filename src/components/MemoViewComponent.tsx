import { Copy } from '@/components/Copy'
import { MemoView } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { bech32m } from 'bech32'
import React, { useMemo } from 'react'
import { AddressComponent } from './penumbra/Address'

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
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Sender Address</p>
					<div className='flex items-center gap-x-[8px] min-h-[44px] py-[8px] px-[16px] bg-dark_grey rounded-[10px] text-light_grey text_numbers_s'>
						<Copy text={memoSender} type='last' />
					</div>
				</div>
			) : (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Message</p>
					<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words min-h-[40px]'>
						{memoText}
					</p>
				</div>
			)}
			{memoSender === 'Encrypted' ? (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize encrypted'>Return Address</p>
				</div>
			) : (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Return Address</p>
					<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words monospace'>
						<AddressComponent address={memoReturnAddress!} />
					</p>
				</div>
			)}
		</div>
	)
}
