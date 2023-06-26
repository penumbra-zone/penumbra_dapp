'use client'
import { ActivityList } from '@/components/ActivityList'
import { AssetsList } from '@/components/AssetsList'
import { BalanceAction } from '@/components/BalanceAction'
import { Button } from '@/components/Button'
import { Tabs } from '@/components/Tabs'
import { useAuth } from '@/context/AuthContextProvider'
import { useBalance } from '@/context/BalanceContextProvider'
import { useSearchParams } from 'next/navigation'

export default function Home() {
	const auth = useAuth()
	const { balance } = useBalance()
	const params = useSearchParams()

	return (
		<>
			{auth!.walletAddress ? (
				<div className='flex flex-col items-center justify-center '>
					<div className='py-[16px] w-[800px] bg-brown rounded-[15px]'>
						<BalanceAction />
						<div className='w-[100%] flex items-center justify-between ext:py-[15.5px] tablet:py-[13.5px] px-[16px] border-y-[1px] border-solid border-dark_grey'>
							<div className='flex flex-col'>
								<p className='text_button mb-[4px]'>Stake</p>
							</div>
							<Button
								mode='transparent'
								disabled
								title='Stake'
								className='w-[119px] ext:pt-[7px] tablet:pt-[7px] ext:pb-[7px] tablet:pb-[7px]'
							/>
						</div>
						<Tabs
							tabs={['Assets', 'Activity']}
							initial={params.get('tab')}
							// eslint-disable-next-line react/no-children-prop
							children={(type: string) =>
								type === 'Assets' ? (
									<AssetsList assets={balance} />
								) : (
									<ActivityList />
								)
							}
							className='bg-brown'
						/>
					</div>
				</div>
			) : (
				<p className='h1 mt-[300px] text-center'>
					Connect to Penumbra if you want to have access to dApp
				</p>
			)}
		</>
	)
}
