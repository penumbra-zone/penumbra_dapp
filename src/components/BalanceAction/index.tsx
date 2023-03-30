import { BalanceByAddressResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../App'
import { routesPath } from '../../utils/constants'
import { ArrowUpRightSvg, CachedSvg, DowmloadSvg } from '../Svg'
import { Button } from '../Tab/Button'

export const BalanceAction = () => {
	const navigate = useNavigate()
	let auth = useAuth()
	const [balance, setBalance] = useState<BalanceByAddressResponse>()

	useEffect(() => {
		if (!auth.user) return
		window.penumbra.on('balance', balance => setBalance(balance))
	}, [auth])

	const handleNavigate = (url: string) => () => navigate(url)
	
	return (
		<div className='w-[100%] flex flex-col items-center'>
			<div className="relative ext:w-[40px] ext:h-[40px] tablet:w-[51px] tablet:h-[51px] bg-brown rounded-[50%] li_gradient text_body before:content-['PNB'] before:absolute before:top-[0.5px] before:left-[0.5px] before:w-[calc(100%-1px)] before:h-[calc(100%-1px)] before:bg-brown before:rounded-[50%] before:flex before:items-center before:justify-center"></div>
			<p className='pt-[16px] pb-[24px] text_numbers'>
				{(Number(balance?.amount!.lo) / 10 ** 6).toLocaleString('en-US')} PNB
			</p>
			<div className='flex ext:gap-x-[30px]  tablet:gap-x-[69px] ext:mb-[24px] tablet:mb-[40px]'>
				<div className='flex flex-col items-center'>
					<Button
						mode='gradient'
						title={
							<div className='flex items-center justify-center'>
								<DowmloadSvg />
							</div>
						}
						className='rounded-[50%] w-[51px]  ext:pt-[14px] tablet:pt-[14px]  ext:pb-[14px] tablet:pb-[14px]'
					/>
					<p className='text_button pt-[8px]'>Receive</p>
				</div>
				<div className='flex flex-col items-center'>
					<Button
						mode='gradient'
						onClick={handleNavigate(routesPath.SEND)}
						title={
							<div className='flex items-center justify-center'>
								<ArrowUpRightSvg />
							</div>
						}
						className='rounded-[50%] w-[51px] ext:pt-[14px] tablet:pt-[14px]  ext:pb-[14px] tablet:pb-[14px]'
					/>
					<p className='text_button pt-[8px]'>Send</p>
				</div>
				<div className='flex flex-col items-center'>
					<Button
						mode='gradient'
						title={
							<div className='flex items-center justify-center'>
								<CachedSvg />
							</div>
						}
						className='rounded-[50%] w-[51px]  ext:pt-[14px] tablet:pt-[14px] ext:pb-[14px] tablet:pb-[14px]'
					/>
					<p className='text_button pt-[8px]'>Exchange</p>
				</div>
			</div>
		</div>
	)
}
