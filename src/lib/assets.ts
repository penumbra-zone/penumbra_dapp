import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { uint8ToBase64 } from './uint8ToBase64'
import { bech32m } from 'bech32'
import {
	Amount,
	AssetId,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { calculateAmount } from './calculateAmount'

export const getAssetByAssetId = (
	assets: AssetsResponse[],
	assetId: string
): AssetsResponse | undefined => {
	if (!assets.length) return undefined
	return assets.find(
		i =>
			uint8ToBase64(i.denomMetadata?.penumbraAssetId?.inner as Uint8Array) ===
			assetId
	)!
}

export const getActionAssetDetail = (
	asset: AssetsResponse | undefined,
	amount: Amount | undefined,
	assetId: AssetId
): {
	assetHumanAmount: number
	asssetHumanDenom: string
} => {
	let assetExponent
	let asssetHumanDenom: string
	if (!asset) {
		assetExponent = 0
		asssetHumanDenom = bech32m.encode('passet1', bech32m.toWords(assetId.inner))
	} else {
		const asset1DenomMetadata = asset.denomMetadata
		asssetHumanDenom = asset1DenomMetadata?.display!
		assetExponent =
			asset1DenomMetadata?.denomUnits.find(i => i.denom === asssetHumanDenom)
				?.exponent || 0
	}

	const assetHumanAmount = calculateAmount(
		Number(amount?.lo),
		Number(amount?.hi),
		assetExponent
	)

	return {
		assetHumanAmount,
		asssetHumanDenom,
	}
}
