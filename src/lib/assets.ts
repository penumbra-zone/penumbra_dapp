import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
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
