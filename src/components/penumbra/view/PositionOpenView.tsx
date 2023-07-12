import { useBalance } from '@/context/BalanceContextProvider'
import { getActionAssetDetail, getAssetByAssetId } from '@/lib/assets'
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
	} = getActionAssetDetail(asset1, asset1Amount, asset1Id!)

	const asset2Id = positionOpen?.phi?.pair?.asset2
	const asset2 = getAssetByAssetId(assets, uint8ToBase64(asset2Id!.inner!))
	const asset2Amount = positionOpen?.reserves?.r2
	const {
		assetHumanAmount: asset2HumanAmount,
		asssetHumanDenom: assset2HumanDenom,
	} = getActionAssetDetail(asset2, asset2Amount, asset1Id!)

	const fee = positionOpen?.phi?.component?.fee

	// TODO: add ID:  plpid1ckppehweenlpnskhnt37s4sr2jw6tegmh9h43r627x39ydusg9es3762qz to values
	return (
		<div className='w-[100%] flex flex-col'>
			<p className='h3 mb-[8px] capitalize'>Open Liquidity Position Reserves</p>
			<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
				{`(${asset1HumanAmount} ${assset1HumanDenom}, ${asset2HumanAmount} ${assset2HumanDenom})  Fee: ${fee}`}
			</p>
		</div>
	)
}
