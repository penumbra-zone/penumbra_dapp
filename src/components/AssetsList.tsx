import { AssetBalance } from '@/context/BalanceContextProvider'
import { ChevronLeftIcon } from './Svg'

interface IAssetList {
	assets: AssetBalance[]
}

export const AssetsList: React.FC<IAssetList> = ({ assets }) => {
	return (
		<>
			{assets.map(i => {
				if (!i.display) return
				return (
					<div
						key={i.display}
						className='flex items-center justify-between py-[20px] pl-[22px] pr-[30px] border-y-[1px] border-solid border-dark_grey'
					>
						<div className='flex items-center justify-between'>
							<p className='pl-[16px] text_numbers'>
								{i.amount.toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 20,
								})}
							</p>
							<p className='pl-[4px] pr-[16px] h4 break-all'>{i.display}</p>
						</div>
						<div className='rotate-180'>
							<ChevronLeftIcon />
						</div>
					</div>
				)
			})}
		</>
	)
}
