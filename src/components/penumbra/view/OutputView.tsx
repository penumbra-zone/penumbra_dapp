import {
	OutputView,
	OutputView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { AddressViewComponent } from '../Address'
import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { getActionAssetDetail } from '@/lib/assets'

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
			const { assetHumanAmount, asssetHumanDenom } = getActionAssetDetail(
				asset as unknown as AssetsResponse | undefined,
				assetAmount,
				assetId!
			)

			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Output</p>
					<div className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
						<span>{`${assetHumanAmount} ${asssetHumanDenom} to `}</span>
						<AddressViewComponent addressView={addressView} />
					</div>
				</div>
			)
		}
		default: {
			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize encrypted'>Output</p>
				</div>
			)
		}
	}
}
