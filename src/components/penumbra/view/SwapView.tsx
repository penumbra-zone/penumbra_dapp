import { useBalance } from '@/context/BalanceContextProvider'
import { getAssetByAssetId } from '@/lib/assets'
import { calculateAmount } from '@/lib/calculateAmount'
import { uint8ToBase64 } from '@/lib/uint8ToBase64'
import {
	SwapView,
	SwapView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/dex/v1alpha1/dex_pb'
import React from 'react'

export const SwapViewComponent: React.FC<{ view: SwapView }> = ({ view }) => {
	const { assets } = useBalance()

	switch (view.swapView.case) {
		case 'visible': {
			const visibleSwap: SwapView_Visible = view.swapView.value

			const asset1Info = visibleSwap.swap?.body?.tradingPair?.asset1
			const asset2Info = visibleSwap.swap?.body?.tradingPair?.asset2

			const asset1 = getAssetByAssetId(
				assets,
				uint8ToBase64(asset1Info!.inner!)
			)

			const asset2 = getAssetByAssetId(
				assets,
				uint8ToBase64(asset2Info!.inner!)
			)

			if (!asset1 || !asset2) return

			const asset1DenomMetadata = asset1.denomMetadata
			const asset2DenomMetadata = asset2.denomMetadata

			const asset1Amount = visibleSwap.swap?.body?.delta1I
			const asset2Amount = visibleSwap.swap?.body?.delta2I

			const asset1Exponent =
				asset1DenomMetadata?.denomUnits.find(
					i => i.denom === asset1DenomMetadata?.display
				)?.exponent || 0
			const asset2Exponent =
				asset2DenomMetadata?.denomUnits.find(
					i => i.denom === asset2DenomMetadata?.display
				)?.exponent || 0

			const asset1HumanAmount = calculateAmount(
				Number(asset1Amount?.lo),
				Number(asset1Amount?.hi),
				asset1Exponent
			)
			const asset2HumanAmount = calculateAmount(
				Number(asset2Amount?.lo),
				Number(asset2Amount?.hi),
				asset2Exponent
			)

			const assset1HumanDenom = asset1DenomMetadata?.display
			const assset2HumanDenom = asset2DenomMetadata?.display

			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Swap</p>
					<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
						{asset1HumanAmount
							? `${asset1HumanAmount} ${assset1HumanDenom} for ${assset2HumanDenom}`
							: `${asset2HumanAmount} ${assset2HumanDenom} for ${assset1HumanDenom}`}
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
