import {
	NotesResponse,
	TransactionInfoResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { ModalWrapper } from '../../ModalWrapper'
import { uint8ToBase64 } from '../../../utils/uint8ToBase64'
import { useBalance } from '../../../context'
import { base64_to_bech32 } from 'penumbra-wasm'
import { getDenomByAssetId } from '../../../utils/assets'
import { useMemo } from 'react'
import { getShortKey } from '../../../utils/getShortValue'

type TxDetailModalProps = {
	show: boolean
	transaction: TransactionInfoResponse
	notes: NotesResponse[]
	onClose: () => void
}

export const TxDetailModal: React.FC<TxDetailModalProps> = ({
	show,
	notes,
	transaction,
	onClose,
}) => {
	const { assets } = useBalance()

	const actionText = useMemo(() => {
		return transaction.txInfo?.view?.bodyView?.actionViews.map(i => {
			const type = i.actionView.case

			if (type === 'spend') {
				try {
					const nullifier = uint8ToBase64(
						i.actionView.value.spendView.value?.spend?.body
							?.nullifier as Uint8Array
					)
					const note = notes.find(
						i =>
							uint8ToBase64(i.noteRecord?.nullifier?.inner as Uint8Array) ===
							nullifier
					)
					const assetId = getDenomByAssetId(
						assets,
						uint8ToBase64(
							note?.noteRecord?.note?.value?.assetId?.inner as Uint8Array
						)
					)

					return {
						type,
						text: `${
							Number(note?.noteRecord?.note?.value?.amount?.lo) / 10 ** 6
						} ${assetId}`,
					}
				} catch (error) {
					return {
						type,
						text: 'Encrypted',
					}
				}
			} else if (type === 'output') {
				try {
					const assetId = getDenomByAssetId(
						assets,
						uint8ToBase64(
							//@ts-ignore
							i.actionView.value.outputView.value.note.value.valueView.value
								.assetId.inner as Uint8Array
						)
					)

					const addresView =
						//@ts-ignore
						i.actionView.value.outputView.value.note.address.addressView
					const address = base64_to_bech32(
						'penumbrav2t',
						uint8ToBase64(addresView.value.address.inner)
					)

					const amount =
						//@ts-ignore
						i.actionView.value.outputView.value.note.value.valueView.value
							.amount.lo

					return {
						text:
							addresView.case === 'opaque'
								? `${Number(amount) / 10 ** 6} ${assetId} to ${getShortKey(
										address
								  )}`
								: `${Number(amount) / 10 ** 6} ${assetId}`,
						type: addresView.case === 'opaque' ? 'Send' : 'Receive',
					}
				} catch (error) {
					return {
						type,
						text: 'Encrypted',
					}
				}
			} else if (type === 'positionOpen') {
				try {
					const asset1 = getDenomByAssetId(
						assets,
						uint8ToBase64(
							i.actionView.value.position?.phi?.pair?.asset1
								?.inner as Uint8Array
						)
					)
					const asset2 = getDenomByAssetId(
						assets,
						uint8ToBase64(
							i.actionView.value.position?.phi?.pair?.asset2
								?.inner as Uint8Array
						)
					)
					return {
						text: `Trading Pair: (${asset1}, ${asset2})`,
						type,
					}
				} catch (error) {
					return {
						type,
						text: 'Encrypted',
					}
				}
			} else if (type === 'swap') {
				try {
					const delta1I = Number(
						i.actionView.value.swapView.value?.swap?.body?.delta1I?.lo
					)
					const delta2I =
						i.actionView.value.swapView.value?.swap?.body?.delta2I?.lo

					const asset1 = getDenomByAssetId(
						assets,
						uint8ToBase64(
							i.actionView.value.swapView.value?.swap?.body?.tradingPair?.asset1
								?.inner as Uint8Array
						)
					)

					const asset2 = getDenomByAssetId(
						assets,
						uint8ToBase64(
							i.actionView.value.swapView.value?.swap?.body?.tradingPair?.asset2
								?.inner as Uint8Array
						)
					)

					if (delta1I) {
						return {
							text: `${Number(delta1I) / 10 ** 6} ${asset1} for ${asset2}`,
							type,
						}
					}
					return {
						text: `${Number(delta2I) / 10 ** 6} ${asset2} for ${asset1}`,
						type,
					}
				} catch (error) {
					return {
						type,
						text: 'Encrypted',
					}
				}
			} else {
				return {
					text: '',
					type,
				}
			}
		})
	}, [transaction, assets, notes])

	return (
		<ModalWrapper
			show={show}
			onClose={onClose}
			className='pt-[30px] pb-[52px] px-[24px] w-[500px]'
		>
			<div className='overflow-scroll'>
				<div className='w-[100%]'>
					{actionText!.map((i, index) => {
						return (
							<div key={index} className='w-[100%] flex flex-col mt-[16px]'>
								<p className='h2 mb-[8px] capitalize'>{i.type}</p>
								<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
									{i.text}
								</p>
							</div>
						)
					})}
				</div>
			</div>
		</ModalWrapper>
	)
}
