'use client'
import { Button } from '@/components/Button'
import { Copy } from '@/components/Copy'
import { ChevronLeftIcon, EncryptedSvg } from '@/components/Svg'
import { useAuth } from '@/context/AuthContextProvider'
import { useBalance } from '@/context/BalanceContextProvider'
import { getAssetByAssetId } from '@/lib/assets'
import { routesPath } from '@/lib/constants'
import { extensionTransport } from '@/lib/extensionTransport'
import { uint8ToBase64 } from '@/lib/uint8ToBase64'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import {
	TransactionInfoByHashRequest,
	TransactionInfoByHashResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createPromiseClient } from '@bufbuild/connect'
import { bech32m } from 'bech32'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

const EncryptedValue: React.FC<{ label: string }> = ({ label }) => {
	return (
		<div className='flex items-center'>
			<EncryptedSvg />
			<p className='ml-[8px] text-light_brown capitalize'>
				{label} (Encrypted)
			</p>
		</div>
	)
}

export default function TransactionDetail() {
	const auth = useAuth()
	const { push } = useRouter()
	const params = useSearchParams()

	const { assets } = useBalance()
	const [tx, setTx] = useState<TransactionInfoByHashResponse | null>(null)

	const { memoText, memoSender, chainId, feeText, expiryText } = useMemo(() => {
		const bodyView = tx?.txInfo?.view?.bodyView
		const memoView = bodyView?.memoView?.memoView

		let memoText = 'Encrypted'
		let memoSender = 'Encrypted'

		if (memoView?.case == 'visible') {
			memoText = memoView.value.plaintext!.text
			memoSender = bech32m.encode(
				'penumbrav2t',
				bech32m.toWords(memoView.value.plaintext!.sender!.inner),
				160
			)
		}

		const chainId = bodyView?.chainId
		const feeAmount =
			Number(bodyView?.fee?.amount?.lo) +
			2 ** 64 * Number(bodyView?.fee?.amount?.hi)
		const feeText = `${feeAmount} upenumbra`
		let expiryText = 'None'
		if (bodyView?.expiryHeight != BigInt(0))
			expiryText = `${bodyView?.expiryHeight}`

		return {
			memoText,
			memoSender,
			chainId,
			feeText,
			expiryText,
		}
	}, [tx])

	const actionText = useMemo(() => {
		if (!tx) return []
		return tx.txInfo?.view?.bodyView?.actionViews.map(i => {
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
					const address = bech32m.encode(
						'penumbrav2t',
						bech32m.toWords(addresView.value.address.inner),
						160
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
	}, [tx, assets])

	useEffect(() => {
		if (!auth!.walletAddress) return
		const getTransaction = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)
			const request = new TransactionInfoByHashRequest().fromJson({
				id: {
					hash: params.get('hash'),
				},
			})

			const tx = await client.transactionInfoByHash(request)

			if (!Object.values(tx.txInfo!).length) return
			setTx(tx)
		}
		getTransaction()
	}, [params, auth])

	const handleBack = () => push(`${routesPath.HOME}?tab=Activity`)

	return (
		<>
			{auth!.walletAddress ? (
				<>
					{tx && (
						<div className='w-[100%] flex justify-center mt-[24px] mb-[40px]'>
							<div className='flex flex-col'>
								<Button
									mode='icon_transparent'
									onClick={handleBack}
									title='Back'
									iconLeft={<ChevronLeftIcon stroke='#E0E0E0' />}
									className='self-start'
								/>
								<div className='flex items-center mb-[16px] mt-[26px] gap-x-[16px] text_numbers_s'>
									<p className='h1'>Transaction</p>
									{params.get('hash') && (
										<Copy text={params.get('hash') as string} type='center' />
									)}
									<p className='text-green text_numbers_s '>
										Block height : {Number(tx?.txInfo?.height)}
									</p>
								</div>
								<p className='h2 pb-[8px]'>Memo</p>
								<div className='flex flex-col px-[16px] pt-[16px] pb-[22px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
									{memoSender === 'Encrypted' ? (
										<EncryptedValue label='Sender Address' />
									) : (
										<div className='w-[100%] flex flex-col'>
											<p className='h3 mb-[8px] capitalize'>Sender Address</p>
											<div className='flex items-center gap-x-[8px] min-h-[44px] py-[8px] px-[16px] bg-dark_grey rounded-[10px] text-light_grey text_numbers_s'>
												<Copy text={memoSender} type='last' />
											</div>
										</div>
									)}
									{memoText === 'Encrypted' ? (
										<EncryptedValue label='Message' />
									) : (
										<div className='w-[100%] flex flex-col'>
											<p className='h3 mb-[8px] capitalize'>Message</p>
											<p className='min-h-[44px] py-[8px] px-[16px] bg-dark_grey rounded-[10px] text_numbers_s text-light_grey break-words flex items-center'>
												{memoText}
											</p>
										</div>
									)}
								</div>
								<p className='h2 mb-[8px] mt-[16px]'>Actions</p>
								<div className='flex flex-col px-[16px] py-[16px] pb-[22px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
									{actionText!.map((i, index) =>
										i.text === 'Encrypted' ? (
											<EncryptedValue key={index} label={i.type as string} />
										) : (
											<div key={index} className='w-[100%] flex flex-col '>
												<p className='h3 mb-[8px] capitalize'>{i.type}</p>
												<p className='py-[8px] px-[16px] bg-dark_grey rounded-[10px] text_numbers_s text-light_grey break-all min-h-[44px] flex items-center'>
													{i.text}
												</p>
											</div>
										)
									)}
								</div>
								<p className='h2 mb-[8px] mt-[16px]'>Transaction Data</p>
								<div className='flex flex-col px-[16px] py-[16px] pb-[22px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
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
							</div>
						</div>
					)}
				</>
			) : (
				<p className='h2 mt-[300px] text-center'>
					Connect to Penumbra if you want to have access to dApp
				</p>
			)}
		</>
	)
}
