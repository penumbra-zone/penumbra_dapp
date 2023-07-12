import { useBalance } from '@/context/BalanceContextProvider'
import { getAssetByAssetId } from '@/lib/assets'
import { calculateAmount } from '@/lib/calculateAmount'
import { uint8ToBase64 } from '@/lib/uint8ToBase64'
import {
	SwapView,
	SwapView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/dex/v1alpha1/dex_pb'
import { bech32m } from 'bech32'
import React from 'react'

export const SwapViewComponent: React.FC<{ view: SwapView }> = ({ view }) => {
	const { assets } = useBalance()

	switch (view.swapView.case) {
		case 'visible': {
			const visibleSwap: SwapView_Visible = view.swapView.value

			const asset1Info = visibleSwap.swapPlaintext?.tradingPair?.asset1
			const asset2Info = visibleSwap.swapPlaintext?.tradingPair?.asset2
			const feeInfo = visibleSwap.swapPlaintext?.claimFee?.assetId

			const asset1 = getAssetByAssetId(
				assets,
				uint8ToBase64(asset1Info!.inner!)
			)

			const asset2 = getAssetByAssetId(
				assets,
				uint8ToBase64(asset2Info!.inner!)
			)

			const feeAsset = assets.find(
				asset => asset.denomMetadata?.display === 'penumbra'
			)

			const asset1Amount = visibleSwap.swapPlaintext?.delta1I
			let asset1Exponent
			let assset1HumanDenom: string

			if (!asset1) {
				asset1Exponent = 0
				assset1HumanDenom = bech32m.encode(
					'passet1',
					bech32m.toWords(asset1Info!.inner!)
				)
			} else {
				const asset1DenomMetadata = asset1.denomMetadata
				assset1HumanDenom = asset1DenomMetadata?.display!
				asset1Exponent =
					asset1DenomMetadata?.denomUnits.find(
						i => i.denom === assset1HumanDenom
					)?.exponent || 0
			}
			const asset1HumanAmount = calculateAmount(
				Number(asset1Amount?.lo),
				Number(asset1Amount?.hi),
				asset1Exponent
			)

			const asset2Amount = visibleSwap.swapPlaintext?.delta2I
			let asset2Exponent
			let assset2HumanDenom: string

			if (!asset2) {
				asset2Exponent = 0
				assset2HumanDenom = bech32m.encode(
					'passet1',
					bech32m.toWords(asset2Info!.inner!)
				)
			} else {
				const asset2DenomMetadata = asset2.denomMetadata
				assset2HumanDenom = asset2DenomMetadata?.display!
				asset2Exponent =
					asset2DenomMetadata?.denomUnits.find(
						i => i.denom === assset2HumanDenom
					)?.exponent || 0
			}
			const asset2HumanAmount = calculateAmount(
				Number(asset2Amount?.lo),
				Number(asset2Amount?.hi),
				asset2Exponent
			)

			// TODO: visibleSwap.swapPlaintext?.claimFee should include assetId
			const feeAmount = visibleSwap.swapPlaintext?.claimFee?.amount
			let feeExponent
			let feeHumanDenom: string
			
			if (!feeAsset) {
				feeExponent = 0
				//TODO: delete penumbra when visibleSwap.swapPlaintext?.claimFee include assetID
				feeHumanDenom = feeInfo
					? bech32m.encode('passet1', bech32m.toWords(feeInfo!.inner!))
					: 'penumbra'
			} else {
				const feeDenomMetadata = feeAsset.denomMetadata
				feeHumanDenom = feeDenomMetadata?.display!
				feeExponent =
					feeDenomMetadata?.denomUnits.find(i => i.denom === feeHumanDenom)
						?.exponent || 0
			}

			const feeHumanAmount = calculateAmount(
				Number(feeAmount?.lo),
				Number(feeAmount?.hi),
				feeExponent
			)

			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Swap</p>
					<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
						{asset1HumanAmount
							? `${asset1HumanAmount} ${assset1HumanDenom} for ${assset2HumanDenom} and paid claim fee ${feeHumanAmount} ${feeHumanDenom}`
							: `${asset2HumanAmount} ${assset2HumanDenom} for ${assset1HumanDenom} and paid claim fee ${feeHumanAmount} ${feeHumanDenom}`}
					</p>
				</div>
			)
		}
		default: {
			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize encrypted'>Swap</p>
				</div>
			)
		}
	}
}
