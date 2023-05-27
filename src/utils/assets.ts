import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { AssetBalance } from '../context'
import { uint8ToBase64 } from './uint8ToBase64'

export const getBalanceByDenom = (
	balance: AssetBalance[],
	denom: string
): string => {
	return (
		(Number(balance.find(i => i.denom?.denom === denom)?.amount?.lo) || 0) /
		10 ** 6
	).toLocaleString('en-US')
	// (
	// 	Number(
	// 		balance[denom || initialDenom]
	// 			? balance[denom || initialDenom].amount!.lo
	// 			: 0
	// 	) /
	// 	10 ** 6
	// ).toLocaleString('en-US')
}

export const getAssetDenom = (
	balance: AssetBalance[],
	denom?: string,
	initialDenom = 'KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA='
): string => {
	return (
		balance.find(i => i.denom?.denom === (denom || initialDenom))?.denom
			?.denom || ''
	)
	//  balance[denom || initialDenom]
	// 	? balance[denom || initialDenom].denom.denom
	// 	: ''
}

export const getDenomByAssetId = (
	assets: AssetsResponse[],
	assetId: string
): string => {
	if (!assets.length) return ''
	return assets.find(
		i => uint8ToBase64(i.asset?.id?.inner as Uint8Array) === assetId
	)?.asset?.denom?.denom!
}
