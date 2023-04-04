import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ActivityList } from '../../components/ActivityList'
import { BalanceAction } from '../../components/BalanceAction'
import { ChevronLeftIcon } from '../../components/Svg'
import { Button } from '../../components/Tab/Button'
import { routesPath } from '../../utils/constants'

export const BalanceDetail = () => {
	const navigate = useNavigate()
	const { state } = useLocation()

	const handleBack = () => navigate(routesPath.HOME)

	return (
		<div className='w-[100%] mt-[20px] mb-[20px] '>
			<div className='flex flex-col items-center bg-brown rounded-[15px] relative ext:pb-[28px] tablet:pb-[40px]'>
				<Button
					mode='icon_transparent'
					onClick={handleBack}
					title='Back'
					iconLeft={<ChevronLeftIcon stroke='#E0E0E0' />}
					className='self-start ext:mt-[20px] ext:ml-[8px] tablet:mt-[24px] tablet:ml-[16px]'
				/>
				<div className='w-[100%] ext:mt-[25px] tablet:mt-[27px] mb-[40px]'>
					<BalanceAction name={state} />
				</div>
				<ActivityList />
			</div>
		</div>
	)
}
