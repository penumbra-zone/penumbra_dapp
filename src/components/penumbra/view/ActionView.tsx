import { ActionView } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { SpendViewComponent } from './SpendView'
import { OutputViewComponent } from './OutputView'
import { SwapViewComponent } from './SwapView'
import { PositionOpenViewComponent } from './PositionOpenView'

export const ActionViewComponent: React.FC<{ actionView: ActionView }> = ({
	actionView,
}) => {
	switch (actionView.actionView.case) {
		case 'spend':
			return <SpendViewComponent view={actionView.actionView.value} />
		case 'output':
			return <OutputViewComponent view={actionView.actionView.value} />
		case 'swap':
			return <SwapViewComponent view={actionView.actionView.value} />
		case 'positionOpen':
			return <PositionOpenViewComponent view={actionView.actionView.value} />
		default:
			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>
						Unsupported Action {actionView.actionView.case}
					</p>
				</div>
			)
	}
}
