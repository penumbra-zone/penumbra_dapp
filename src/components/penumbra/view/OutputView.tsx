import {
	OutputView,
	OutputView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { AddressViewComponent } from '../Address'
import {
	AssetId,
	DenomMetadata,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { calculateAmount } from '@/lib/calculateAmount'

export const OutputViewComponent: React.FC<{ view: OutputView }> = ({
	view,
}) => {
	// TODO: can the asset info be put in the view correctly instead?

	switch (view.outputView.case) {
		case 'visible': {
			// view.outputView.value is OutputView_Visible
			const visibleOutput: OutputView_Visible = view.outputView.value

			const addressView = visibleOutput.note?.address!
			const valueView = visibleOutput.note?.value?.valueView

			// TODO: handle known/unknown denoms
			// TODO: may need fixes to view protos
			// TODO: knownDenom only has a denom string, not a denom metadata...
			let denomMetadata: DenomMetadata | undefined
			let assetId: AssetId | undefined
			if (valueView?.case === 'knownDenom') {
				denomMetadata = valueView.value.denom
			} else if (valueView?.case === 'unknownDenom') {
				assetId = valueView.value.assetId
			}

			// TODO: human-formatting an amount should be a helper function
			// TODO: ValueView component?
			const amount = valueView?.value?.amount
			const exponent = denomMetadata
				? denomMetadata?.denomUnits.find(
						i => i.denom === denomMetadata?.display
				  )?.exponent || 0
				: 0

			const humanAmount = calculateAmount(
				Number(amount?.lo),
				Number(amount?.hi),
				exponent
			)

			let humanDenom = denomMetadata
				? denomMetadata?.display
				: 'qwasdasd' /* TODO: || passet1... for unknown denoms */

			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Output</p>
					<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
						<span>
							{humanAmount} {humanDenom} to{' '}
						</span>
						<AddressViewComponent addressView={addressView} />
					</p>
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
