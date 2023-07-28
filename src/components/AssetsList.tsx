'use client'

import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { ChevronLeftIcon } from './Svg'
import { useAssets, useBalance } from '@/hooks'
import { calculateAmount } from '@/lib'

interface IAsset {
	asset: AssetsResponse
}

export const Asset: React.FC<IAsset> = ({ asset }) => {
	const balance = useBalance(asset)

	return (
		<>
			{balance && (
				<div className='flex items-center justify-between py-[16px] px-[20px]  border-b-[1px] border-solid border-dark_grey'>
					<div className='flex items-center justify-between text_button'>
						<p>
							{calculateAmount(
								Number(balance.balance?.amount?.lo),
								Number(balance.balance?.amount?.hi),
								Number(
									balance.denomMetadata?.denomUnits.find(
										unit => unit.denom === balance.denomMetadata?.display
									)?.exponent
								)
							)}
						</p>
						<p className='pl-[4px] break-all'>
							{balance.balance?.assetId?.altBech32m}
						</p>
					</div>
					<div className='rotate-180'>
						<ChevronLeftIcon />
					</div>
				</div>
			)}
		</>
	)
}

interface IAssetList {}

export const AssetsList: React.FC<IAssetList> = () => {
	const assets = useAssets()

	return (
		<div className='flex flex-col mt-[24px] min-h-[120px]'>
			{assets.map(asset => {
				return <Asset asset={asset} key={asset.denomMetadata?.display} />
			})}
		</div>
	)
}
