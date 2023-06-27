'use client'
import { useAuth } from '@/context/AuthContextProvider'
import React, { useEffect, useState } from 'react'
import { Button } from './Button'
import Image from 'next/image'
import vercel from '../../public/logo.png'

import { routesPath } from '@/lib/constants'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { StatusStreamRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { extensionTransport } from '@/lib/extensionTransport'
import { ProgressBar } from './ProgressBar'
import Link from 'next/link'


const getPercentage = (partialValue: number, totalValue: number): number => {
	if (!totalValue) return 0
	return Math.round((100 * partialValue) / totalValue)
}

const getShortKey = (text: string) => {
	if (!text) return ''
	return text.slice(0, 35) + '...'
}

export const Header = () => {
	const auth = useAuth()

	const [percent, setPercent] = useState<number>(0)

	useEffect(() => {
		if (!auth!.walletAddress) return setPercent(0)
		async function getSyncPercent() {
			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)
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
				<div className='flex items-center justify-center h-[44px] py-[13px] px-[21px] gap-[8px] rounded-[10px] border-[1px] border-dark_grey bg-brown'>
					{percent > 100 ? (
						<></>
					) : (
						<div className='ext:w-[25px] ext:h-[25px] tablet:w-[35px] tablet:h-[35px] ext:mr-[6px] tablet:mr-[16px] flex items-center'>
							<ProgressBar percent={percent} width='42px' />
						</div>
					)}
					<p className='h3'>{getShortKey(auth!.walletAddress)}</p>
				</div>
			) : (
				<Button
					mode='gradient'
					title='Connect'
					className='w-[200px]'
					onClick={auth!.signin}
				/>
			)}
		</header>
	)
}
