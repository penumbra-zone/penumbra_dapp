'use client'
import { useAuth } from '@/context/AuthContextProvider'
import { useBalance } from '@/context/BalanceContextProvider'
import { getAssetByAssetId } from '@/lib/assets'
import { uint8ToBase64 } from '@/lib/uint8ToBase64'
import {
	TransactionInfoByHashRequest,
	TransactionInfoByHashResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { bech32m } from 'bech32'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { extensionTransport } from '@/lib/extensionTransport'
import { routesPath } from '@/lib/constants'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/Button'
import { ChevronLeftIcon, CopySvg } from '@/components/Svg'
import { getTransactionType } from '@/lib/transactionType'

function truncateHash(hash: string | null, length: number = 6): string {
	if (hash === null) {
		return '';
	}
	if (hash.length <= 2 * length) {
		return hash;
	}
	return hash.slice(0, length) + '…' + hash.slice(-length);
}

export default function TransactionDetail() {
	const auth = useAuth()
	const { push } = useRouter()
	const params = useSearchParams()

	const { assets } = useBalance()
	const [tx, setTx] = useState<TransactionInfoByHashResponse | null>(null)

	const memoView =
		//@ts-ignore
		tx?.txInfo?.view?.bodyView?.memoView?.memoView!

	let memoText = 'Encrypted';
	let memoSender = 'Encrypted';
	console.log(memoView)
	if (memoView?.case == 'visible') {
		memoText = memoView.value.plaintext!.text;
		memoSender = bech32m.encode(
			'penumbrav2t',
			bech32m.toWords(memoView.value.plaintext!.sender!.inner),
			160
		);
	}

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
					// const assetId = getAssetByAssetId(
					// 	assets,
					// 	uint8ToBase64(
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
							text: `${Number(delta1I) / (exponent1 ? 10 ** exponent1 : 1)} ${asset1.display
								} for ${asset2.display}`,
							type,
						}
					}
					return {
						text: `${Number(delta2I) / (exponent2 ? 10 ** exponent2 : 1)} ${asset2.display
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

	const copyToClipboard = () => {
		navigator.clipboard.writeText(params.get('hash') as string)
		toast.success('Successfully copied', {
			position: 'top-center',
			icon: '👏',
			style: {
				borderRadius: '15px',
				background: '#141212',
				color: '#fff',
			},
		})
	}

	return (
		<>
			{auth!.walletAddress ? (
				<>
					{tx && (
						<div className='w-[100%] flex justify-center mt-[24px]'>
							<div>
								<Button
									mode='icon_transparent'
									onClick={handleBack}
									title='Back'
									iconLeft={<ChevronLeftIcon stroke='#E0E0E0' />}
									className='self-start'
								/>
								<div className='h1 mb-[12px] mt-[24px]'>
									<p
										style={{ display: "inline-block" }}
									>Transaction <span className='monospace'>{truncateHash(params.get('hash'), 8)}</span></p>
									<p
										className='cursor-pointer hover:no-underline hover:opacity-75'
										onClick={copyToClipboard}
										style={{ display: "inline-block", margin: "0 5px" }}
									>
										<CopySvg width='20' height='20' fill='#524B4B' />
									</p>
									<p
										style={{ display: "inline-block" }}
									>
										(Height {Number(tx?.txInfo?.height)})
									</p>
								</div>
								<p className='h1 mb-[12px] mt-[16px]'>Memo</p>
								<div className='flex flex-col p-[16px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
									<div className='w-[100%] flex flex-col'>
										<p className='h2 mb-[8px] capitalize'>Sender</p>
										<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
											{memoSender}
										</p>
									</div>
									{memoText !== '' ? (
										<div className='w-[100%] flex flex-col'>
											<p className='h2 mb-[8px] capitalize'>Message</p>
											<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
												{memoText}
											</p>
										</div>
									) : null}
								</div>
								<p className='h1 mb-[12px] mt-[16px]'>Actions</p>
								<div className='flex flex-col p-[16px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
									{actionText!.map((i, index) => (
										i.text === 'Encrypted' ? (
											<div key={index} className='w-[100%] flex flex-col'>
												<p className='h2 mb-[8px] capitalize encrypted'>{i.type} (Encrypted)</p>
											</div>
										) : (
											<div key={index} className='w-[100%] flex flex-col'>
												<p className='h2 mb-[8px] capitalize'>{i.type}</p>
												<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
													{i.text}
												</p>
											</div>
										)
									))}
								</div>
							</div>
						</div>
					)}
				</>
			) : (
				<p className='h1 mt-[300px] text-center'>
					Connect to Penumbra if you want to have access to dApp
				</p>
			)}
		</>
	)
}
