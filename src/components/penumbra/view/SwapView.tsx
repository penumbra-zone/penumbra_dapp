import { ActionCell } from '@/components/ActionCell'
import { useBalance } from '@/context/BalanceContextProvider'
import { getAssetByAssetId, getHumanReadableValue } from '@/lib/assets'
import { calculateAmount } from '@/lib/calculateAmount'
import { UNKNOWN_ASSET_PREFIX } from '@/lib/constants'
import { uint8ToBase64 } from '@/lib/uint8ToBase64'
import {
	SwapView,
	SwapView_Opaque,
	SwapView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/dex/v1alpha1/dex_pb'
import { bech32m } from 'bech32'
import React from 'react'

export const SwapViewComponent: React.FC<{ view: SwapView }> = ({ view }) => {
	const { assets } = useBalance()

	switch (view.swapView.case) {
		case 'visible': {
			const visibleSwap: SwapView_Visible = view.swapView.value

			const asset1Id = visibleSwap.swapPlaintext?.tradingPair?.asset1
			const asset1 = getAssetByAssetId(assets, uint8ToBase64(asset1Id!.inner!))
			const asset1Amount = visibleSwap.swapPlaintext?.delta1I
			const {
				assetHumanAmount: asset1HumanAmount,
				asssetHumanDenom: assset1HumanDenom,
			} = getHumanReadableValue(asset1, asset1Amount, asset1Id!)

			const asset2Id = visibleSwap.swapPlaintext?.tradingPair?.asset2
			const asset2 = getAssetByAssetId(assets, uint8ToBase64(asset2Id!.inner!))
			const asset2Amount = visibleSwap.swapPlaintext?.delta2I
			const {
				assetHumanAmount: asset2HumanAmount,
				asssetHumanDenom: assset2HumanDenom,
			} = getHumanReadableValue(asset2, asset2Amount, asset2Id!)

			// TODO: add getActionAssetDetail when visibleSwap.swapPlaintext?.claimFee include assetID
			const feeAssetId = visibleSwap.swapPlaintext?.claimFee?.assetId
			const feeAsset = assets.find(
				asset => asset.denomMetadata?.display === 'penumbra'
			)

			// TODO: visibleSwap.swapPlaintext?.claimFee should include assetId
			const feeAmount = visibleSwap.swapPlaintext?.claimFee?.amount
			let feeExponent
			let feeHumanDenom: string

			if (!feeAsset) {
				feeExponent = 0
				//TODO: delete penumbra when visibleSwap.swapPlaintext?.claimFee include assetID
				feeHumanDenom = feeAssetId
					? bech32m.encode(
							UNKNOWN_ASSET_PREFIX,
							bech32m.toWords(feeAssetId!.inner!)
					  )
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
				<ActionCell title='Swap'>
					{asset1HumanAmount
						? `${asset1HumanAmount} ${assset1HumanDenom} for ${assset2HumanDenom} and paid claim fee ${feeHumanAmount} ${feeHumanDenom}`
						: `${asset2HumanAmount} ${assset2HumanDenom} for ${assset1HumanDenom} and paid claim fee ${feeHumanAmount} ${feeHumanDenom}`}
				</ActionCell>
			)
		}
		case 'opaque': {
			const opaqueSwap: SwapView_Opaque = view.swapView.value

			const asset1Id = opaqueSwap.swap?.body?.tradingPair?.asset1
			const asset1 = getAssetByAssetId(assets, uint8ToBase64(asset1Id!.inner!))
			const asset1Amount = opaqueSwap.swap?.body?.delta1I
			const { asssetHumanDenom: assset1HumanDenom } = getHumanReadableValue(
				asset1,
				asset1Amount,
				asset1Id!
			)

			const asset2Id = opaqueSwap.swap?.body?.tradingPair?.asset2
			const asset2 = getAssetByAssetId(assets, uint8ToBase64(asset2Id!.inner!))
			const asset2Amount = opaqueSwap.swap?.body?.delta2I
			const { asssetHumanDenom: assset2HumanDenom } = getHumanReadableValue(
				asset2,
				asset2Amount,
				asset2Id!
			)

			return (
				<ActionCell title='Swap'>
					{`Opaque swap for trading pair: ${assset1HumanDenom} <=> ${assset2HumanDenom}`}
				</ActionCell>
			)
		}
		default: {
			return <ActionCell title='Swap' isEncrypted={true} />
		}
	}
}
