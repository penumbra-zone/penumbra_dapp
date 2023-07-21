import { getHumanReadableValue } from '@/lib'
import {
	SpendView,
	SpendView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { AddressViewComponent } from '../Address'
import { ActionCell } from '@/components/ActionCell'

export const SpendViewComponent: React.FC<{ view: SpendView }> = ({ view }) => {
	switch (view.spendView.case) {
		case 'visible': {
			const visibleSpend: SpendView_Visible = view.spendView.value
			const valueView = visibleSpend.note?.value?.valueView
			const addressView = visibleSpend.note?.address!

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
				<ActionCell title='Spend'>
					{assetHumanAmount} {asssetHumanDenom} from&nbsp;
					<AddressViewComponent addressView={addressView} />
				</ActionCell>
			)
		}
		default: {
			// spendView.spendView.value is SpendView_Opaque
			//const opaqueSpend: SpendView_Opaque = view.spendView.value;
			return <ActionCell title='Spend' isEncrypted={true} />
		}
	}
}
