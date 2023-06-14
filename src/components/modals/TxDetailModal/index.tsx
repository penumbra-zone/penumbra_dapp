import { TransactionInfoResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { base64_to_bech32 } from 'penumbra-wasm'
import { useMemo } from 'react'
import { useBalance } from '../../../context'
import { getAssetByAssetId } from '../../../utils/assets'
import { uint8ToBase64 } from '../../../utils/uint8ToBase64'
import { ModalWrapper } from '../../ModalWrapper'

type TxDetailModalProps = {
	show: boolean
	transaction: TransactionInfoResponse

	onClose: () => void
}

export const TxDetailModal: React.FC<TxDetailModalProps> = ({
	show,
	transaction,
	onClose,
}) => {
	const { assets } = useBalance()

	const actionText = useMemo(() => {
		return transaction.txInfo?.view?.bodyView?.actionViews.map(i => {
			const type = i.actionView.case

			if (type === 'spend') {
				try {
					const assetValue =
						//@ts-ignore
						i.actionView.value.spendView.value?.note.value.valueView.value
					const asset = getAssetByAssetId(
						assets,
						uint8ToBase64(assetValue.assetId.inner)
					).denomMetadata!

					const exponent = asset.denomUnits.find(
						i => i.denom === asset.display
					)?.exponent

					const amount =
						(Number(assetValue.amount?.lo) +
							2 ** 64 * Number(assetValue.amount?.hi)) /
						(exponent ? 10 ** exponent : 1)

					return {
						type,
						text: `${amount} ${asset.display}`,
					}
				} catch (error) {
					return {
						type,
						text: 'Encrypted',
					}
				}
			} else if (type === 'output') {
				try {
					// const assetId = getAssetByAssetId(
					// 	assets,
					// 	uint8ToBase64(
					// 		//@ts-ignore
					// 		i.actionView.value.outputView.value.note.value.valueView.value
					// 			.assetId.inner as Uint8Array
					// 	)
					// )
					const asset = getAssetByAssetId(
						assets,
						uint8ToBase64(
							//@ts-ignore
							i.actionView.value.outputView.value.note.value.valueView.value
								.assetId.inner as Uint8Array
						)
					).denomMetadata!

					const addresView =
						//@ts-ignore
						i.actionView.value.outputView.value.note.address.addressView
					const address = base64_to_bech32(
						'penumbrav2t',
						uint8ToBase64(addresView.value.address.inner)
					)

					const exponent = asset.denomUnits.find(
						i => i.denom === asset.display
					)?.exponent

					const amount =
						Number(
							//@ts-ignore
							i.actionView.value.outputView.value.note.value.valueView.value
								.amount.lo
						) / (exponent ? 10 ** exponent : 1)

					return {
						text:
							addresView.case === 'opaque'
								? `${amount} ${asset.display} to ${address}`
								: `${amount} ${asset.display}`,
						type: addresView.case === 'opaque' ? 'Output' : 'Output',
					}
				} catch (error) {
					return {
						type,
						text: 'Encrypted',
					}
				}
			} else if (type === 'positionOpen') {
				try {
					// const asset1 = getAssetByAssetId(
					// 	assets,
					// 	uint8ToBase64(
					// 		i.actionView.value.position?.phi?.pair?.asset1
					// 			?.inner as Uint8Array
					// 	)
					// )
					const asset1 = getAssetByAssetId(
						assets,
						uint8ToBase64(
							i.actionView.value.position?.phi?.pair?.asset1
								?.inner as Uint8Array
						)
					).denomMetadata!

					const asset2 = getAssetByAssetId(
						assets,
						uint8ToBase64(
							i.actionView.value.position?.phi?.pair?.asset2
								?.inner as Uint8Array
						)
					).denomMetadata!

					// const asset2 = getAssetByAssetId(
					// 	assets,
					// 	uint8ToBase64(
					// 		i.actionView.value.position?.phi?.pair?.asset2
					// 			?.inner as Uint8Array
					// 	)
					// )
					return {
						text: `Trading Pair: (${asset1.display}, ${asset2.display})`,
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

					// const asset1 = getAssetByAssetId(
					// 	assets,
					// 	uint8ToBase64(
					// 		i.actionView.value.swapView.value?.swap?.body?.tradingPair?.asset1
					// 			?.inner as Uint8Array
					// 	)
					// )
					const asset1 = getAssetByAssetId(
						assets,
						uint8ToBase64(
							i.actionView.value.swapView.value?.swap?.body?.tradingPair?.asset1
								?.inner as Uint8Array
						)
					).denomMetadata!

					const exponent1 = asset1.denomUnits.find(
						i => i.denom === asset1.display
					)?.exponent

					// const asset2 = getAssetByAssetId(
					// 	assets,
					// 	uint8ToBase64(
					// 		i.actionView.value.swapView.value?.swap?.body?.tradingPair?.asset2
					// 			?.inner as Uint8Array
					// 	)
					// )

					const asset2 = getAssetByAssetId(
						assets,
						uint8ToBase64(
							i.actionView.value.swapView.value?.swap?.body?.tradingPair?.asset2
								?.inner as Uint8Array
						)
					).denomMetadata!

					const exponent2 = asset2.denomUnits.find(
						i => i.denom === asset2.display
					)?.exponent

					if (delta1I) {
						return {
							text: `${Number(delta1I) / (exponent1 ? 10 ** exponent1 : 1)} ${
								asset1.display
							} for ${asset2.display}`,
							type,
						}
					}
					return {
						text: `${Number(delta2I) / (exponent2 ? 10 ** exponent2 : 1)} ${
							asset2.display
						} for ${asset1.display}`,
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
	}, [transaction, assets])

	return (
		<ModalWrapper show={show} onClose={onClose}>
			<div className='relative overflow-y-auto pt-[30px] pb-[52px] px-[24px]'>
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
