import { getHumanReadableValue } from '@/lib/assets'
import {
	SpendView,
	SpendView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { AddressViewComponent } from '../Address'

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
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Spend</p>
					<div className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
						<span>{`${assetHumanAmount} ${asssetHumanDenom} from `}</span>
						<AddressViewComponent addressView={addressView} />
					</div>
				</div>
			)
		}
		default: {
			// spendView.spendView.value is SpendView_Opaque
			//const opaqueSpend: SpendView_Opaque = view.spendView.value;
			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize encrypted'>Spend</p>
				</div>
			)
		}
	}
}
