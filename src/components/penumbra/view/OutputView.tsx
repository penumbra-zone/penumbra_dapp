"use client"

import { getHumanReadableValue } from '@/lib'
import {
	OutputView,
	OutputView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { AddressViewComponent } from '../Address'
import { ActionCell } from '@/components/ActionCell'

export const OutputViewComponent: React.FC<{ view: OutputView }> = ({
	view,
}) => {
	switch (view.outputView.case) {
		case 'visible': {
			const visibleOutput: OutputView_Visible = view.outputView.value

			const addressView = visibleOutput.note?.address!
			const valueView = visibleOutput.note?.value?.valueView

			const assetId =
				valueView?.case === 'unknownDenom' ? valueView.value.assetId : undefined
			const asset =
				valueView?.case === 'unknownDenom'
					? undefined
					: { denomMetadata: valueView?.value?.denom }
			const assetAmount = valueView?.value?.amount
			const { assetHumanAmount, asssetHumanDenom } = getHumanReadableValue(
				asset as unknown as AssetsResponse | undefined,
				assetAmount,
				assetId!
			)

			return (
				<ActionCell title='Output'>
					{assetHumanAmount} {asssetHumanDenom} to&nbsp;
					<AddressViewComponent addressView={addressView} />
				</ActionCell>
			)
		}
		default: {
			return <ActionCell title='Output' isEncrypted={true} />
		}
	}
}
