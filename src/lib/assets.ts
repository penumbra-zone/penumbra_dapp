import {
	Amount,
	AssetId,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { bech32m } from 'bech32'
import { calculateAmount } from './calculateAmount'
import { UNKNOWN_ASSET_PREFIX } from './constants'
import { uint8ToBase64 } from './uint8ToBase64'

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

// Value - Amount + AssetId
export const getHumanReadableValue = (
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
		asssetHumanDenom = bech32m.encode(
			UNKNOWN_ASSET_PREFIX,
			bech32m.toWords(assetId.inner)
		)
	} else {
		const asset1DenomMetadata = asset.denomMetadata
		asssetHumanDenom = asset1DenomMetadata?.display!
		assetExponent =
			asset1DenomMetadata?.denomUnits.find(i => i.denom === asssetHumanDenom)
				?.exponent || 0
	}

	const assetHumanAmount = amount
		? calculateAmount(Number(amount?.lo), Number(amount?.hi), assetExponent)
		: 0

	return {
		assetHumanAmount,
		asssetHumanDenom,
	}
}
