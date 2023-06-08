import { useAuth } from '../../App'
import { ActivityList } from '../../components/ActivityList'
import { AssetsList } from '../../components/AssetsList'
import { BalanceAction } from '../../components/BalanceAction'
import { Tabs } from '../../components/Tab'
import { Button } from '../../components/Tab/Button'
import { useNavigate } from 'react-router-dom'
import { routesPath } from '../../utils/constants'
import { useBalance } from '../../context'

export const Home = () => {
	const auth = useAuth()
	const navigate = useNavigate()
	const { balance } = useBalance()

	const handleStake = () => navigate(routesPath.VALIDATORS)

	return (
		<>
			{auth.walletAddress ? (
				<div className='flex flex-col items-center justify-center '>
				<div className='py-[16px] w-[800px] bg-brown rounded-[15px]'>
					<BalanceAction />
					<div className='w-[100%] flex items-center justify-between ext:py-[15.5px] tablet:py-[13.5px] px-[16px] border-y-[1px] border-solid border-dark_grey'>
						<div className='flex flex-col'>
							<p className='text_button mb-[4px]'>Stake</p>
						</div>
						<Button
							mode='transparent'
							onClick={handleStake}
							disabled
							title='Stake'
							className='w-[119px] ext:pt-[7px] tablet:pt-[7px] ext:pb-[7px] tablet:pb-[7px]'
						/>
					</div>
					<Tabs
						tabs={['Assets', 'Activity']}
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
					Connect to Penumbra if you want to have access to request
				</p>
			)}
		</>
	)
}
