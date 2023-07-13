import { ActionCell } from '@/components/ActionCell'
import { useBalance } from '@/context/BalanceContextProvider'
import { getAssetByAssetId, getHumanReadableValue } from '@/lib/assets'
import { uint8ToBase64 } from '@/lib/uint8ToBase64'
import { PositionOpen } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/dex/v1alpha1/dex_pb'
import React from 'react'

export const PositionOpenViewComponent: React.FC<{ view: PositionOpen }> = ({
	view,
}) => {
	const { assets } = useBalance()
	const positionOpen = view.position

	const asset1Id = positionOpen?.phi?.pair?.asset1
	const asset1 = getAssetByAssetId(assets, uint8ToBase64(asset1Id!.inner!))
	const asset1Amount = positionOpen?.reserves?.r1
	const {
		assetHumanAmount: asset1HumanAmount,
		asssetHumanDenom: assset1HumanDenom,
	} = getHumanReadableValue(asset1, asset1Amount, asset1Id!)

	const asset2Id = positionOpen?.phi?.pair?.asset2
	const asset2 = getAssetByAssetId(assets, uint8ToBase64(asset2Id!.inner!))
	const asset2Amount = positionOpen?.reserves?.r2
	const {
		assetHumanAmount: asset2HumanAmount,
		asssetHumanDenom: assset2HumanDenom,
	} = getHumanReadableValue(asset2, asset2Amount, asset2Id!)

	const fee = positionOpen?.phi?.component?.fee

	// TODO: add ID:  plpid1ckppehweenlpnskhnt37s4sr2jw6tegmh9h43r627x39ydusg9es3762qz to values
	return (
		<ActionCell title='Swap'>
			{`(${asset1HumanAmount} ${assset1HumanDenom}, ${asset2HumanAmount} ${assset2HumanDenom})  Fee: ${fee}`}
		</ActionCell>
	)
}
