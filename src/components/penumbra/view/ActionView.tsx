"use client"

import { ActionView } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { SpendViewComponent } from './SpendView'
import { OutputViewComponent } from './OutputView'
import { SwapViewComponent } from './SwapView'
import { PositionOpenViewComponent } from './PositionOpenView'
import { ActionCell } from '@/components/ActionCell'

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
				<ActionCell
					title={`Unsupported Action ${actionView.actionView.case}`}
					isEncrypted={true}
				/>
			)
	}
}
