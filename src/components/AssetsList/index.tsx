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
					<div className='flex items-center'>
						{/* <div className="relative w-[51px] h-[51px] bg-brown rounded-[50%] li_gradient text_body before:content-['PNB'] before:absolute before:top-[0.5px] before:left-[0.5px] before:w-[calc(100%-1px)] before:h-[calc(100%-1px)] before:bg-brown before:rounded-[50%] before:flex before:items-center before:justify-center"></div> */}
						<p className='pl-[16px] text_numbers'>
							{(Number(i.amount!.lo) / 10 ** 6).toLocaleString('en-US')}{' '}
							{i?.denom?.denom}
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
