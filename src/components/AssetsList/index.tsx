import { BalanceByAddressResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useNavigate } from 'react-router-dom'
import { routesPath } from '../../utils/constants'
import { ChevronLeftIcon } from '../Svg'
import { AssetBalance } from '../../context'

interface IAssetList {
	assets: AssetBalance[]
}

export const AssetsList: React.FC<IAssetList> = ({ assets }) => {
	const navigate = useNavigate()

	// const handleBalanceDetail = (currencyName: string) => () =>
	// 	navigate(routesPath.BALANCE_DETAIL, { state: currencyName })

	return (
		<>
			{assets.map(i => (
				<div
					key={i.denom?.denom}
					// onClick={handleBalanceDetail(i[0])}
					// role='button'
					// tabIndex={0}
					className='flex items-center justify-between py-[20px] pl-[22px] pr-[30px] border-y-[1px] border-solid border-dark_grey'
				>
					{/* <div className='flex items-center'>
			
						<p className='pl-[16px] text_numbers'>
							{i[1].denom.denom.includes("nft")?(Number(i[1].amount!.lo)).toLocaleString('en-US'):(Number(i[1].amount!.lo) / 10 ** 6).toLocaleString('en-US')}{' '}
							{i[1].denom.denom}
						</p>
					</div> */}
					<div className='flex items-center justify-between'>
						<p className='pl-[16px] text_numbers'>
							{i.denom?.denom.includes('nft')
								? Number(i.amount!.lo).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 20,
								  })
								: (Number(i.amount!.lo) / 10 ** 6).toLocaleString('en-US', {
										minimumFractionDigits: 2,
										maximumFractionDigits: 20,
								  })}
						</p>
						<p className='pl-[4px] pr-[16px] h4 break-all'>
							{i.denom?.denom}
						</p>
					</div>
					<div className='rotate-180'>
						<ChevronLeftIcon />
					</div>
				</div>
			))}
		</>
	)
}
