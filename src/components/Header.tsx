'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import vercel from '../../public/logo.png'
import { Button } from './Button'
import { StatusStreamRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import Link from 'next/link'
import { ProgressBar } from './ProgressBar'
import { useAuth } from '@/context'
import { createViewServiceClient, routesPath, truncateAddress } from '@/lib'

const getPercentage = (partialValue: number, totalValue: number): number => {
	if (!totalValue) return 0
	return Math.round((100 * partialValue) / totalValue)
}

export const Header = () => {
	const auth = useAuth()

	const [percent, setPercent] = useState<number>(0)

	useEffect(() => {
		if (!auth!.walletAddress) return setPercent(0)
		async function getSyncPercent() {
			const client = createViewServiceClient()
			const statusRequest = new StatusStreamRequest({})

			for await (const status of client.statusStream(statusRequest)) {
				setPercent(
					getPercentage(
						Number(status.syncHeight),
						Number(status.latestKnownBlockHeight)
					)
				)
			}
		}

		getSyncPercent()
	}, [auth])

	return (
		<header className='w-[100%] flex justify-between items-center'>
			<Link href={routesPath.HOME} replace>
				<Image
					alt='penumbra logo'
					width={192}
					src={vercel}
					className='object-cover cursor-pointer'
				/>
			</Link>
			{auth!.walletAddress ? (
				<div className='flex items-center justify-center h-[44px] px-[16px] gap-[12px] rounded-[10px] border-[1px] border-dark_grey bg-brown'>
					{percent > 100 ? (
						<></>
					) : (
						<div className='w-[35px] h-[35px]  flex items-center'>
							<ProgressBar percent={percent} width='42px' />
						</div>
					)}
					<p className='text_button'>{truncateAddress(auth!.walletAddress)}</p>
				</div>
			) : (
				<Button
					mode='gradient'
					title='Connect'
					className='w-[200px] h-[44px]'
					onClick={auth!.signin}
				/>
			)}
		</header>
	)
}
