'use client'
import { ActivityList } from '@/components/ActivityList'
import { AssetsList } from '@/components/AssetsList'
import { BalanceAction } from '@/components/BalanceAction'
import { Button } from '@/components/Button'
import { Tabs } from '@/components/Tabs'
import { useAuth, useBalance } from '@/context'
import { useSearchParams } from 'next/navigation'

export default function Home() {
	const auth = useAuth()
	const { balance } = useBalance()
	const params = useSearchParams()

	return (
		<>
			{auth!.walletAddress ? (
				<div className='flex flex-col items-center justify-center mb-[40px]'>
					<div className='pt-[40px] pb-[20px] w-[816px] bg-brown rounded-[10px]'>
						<BalanceAction />
						<div className='w-[100%] flex items-center justify-between p-[16px] border-y-[1px] border-solid border-dark_grey'>
							<div className='flex flex-col'>
								<p className='h2'>Stake</p>
							</div>
							<Button
								mode='transparent'
								disabled
								title='Stake'
								className='w-[119px] h-[36px]'
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
