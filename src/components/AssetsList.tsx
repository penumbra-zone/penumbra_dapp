import { AssetBalance } from '@/context'
import { ChevronLeftIcon } from './Svg'

interface IAssetList {
	assets: AssetBalance[]
}

export const AssetsList: React.FC<IAssetList> = ({ assets }) => {
	return (
		<div className='flex flex-col mt-[24px] min-h-[120px]'>
			{assets.map(i => {
				if (!i.display) return
				return (
					<div
						key={i.display}
						className='flex items-center justify-between py-[16px] px-[20px]  border-b-[1px] border-solid border-dark_grey'
					>
						<div className='flex items-center justify-between text_button'>
							<p>
								{i.amount.toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 20,
								})}
							</p>
							<p className='pl-[4px] break-all'>{i.display}</p>
						</div>
						<div className='rotate-180'>
							<ChevronLeftIcon />
						</div>
					</div>
				)
			})}
		</div>
	)
}
