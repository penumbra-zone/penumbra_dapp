import { useBalance } from '@/context/BalanceContextProvider'
import { getAssetByAssetId } from '@/lib/assets'
import { uint8ToBase64 } from '@/lib/uint8ToBase64'
import {
	SpendView,
	SpendView_Opaque,
	SpendView_Visible,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import { AddressViewComponent } from '../Address'
import { calculateAmount } from '@/lib/calculateAmount'
import { KnownAssets } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/chain/v1alpha1/chain_pb'
import {
	AssetId,
	DenomMetadata,
	ValueView,
	ValueView_KnownDenom,
	ValueView_UnknownDenom,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { bech32 } from 'bech32'

export const SpendViewComponent: React.FC<{ view: SpendView }> = ({ view }) => {
	// TODO: can the asset info be put in the view correctly instead?
	const { assets } = useBalance()
	console.log({ assets })

	switch (view.spendView.case) {
		case 'visible': {
			// spendView.spendView.value is SpendView_Visible
			const visibleSpend: SpendView_Visible = view.spendView.value
			const valueView = visibleSpend.note?.value?.valueView
			const addressView = visibleSpend.note?.address!

			console.log(valueView)

			// handle known/unknown denoms
			let denomMetadata: DenomMetadata | undefined
			let assetId: AssetId | undefined
			if (valueView?.case === 'knownDenom') {
				denomMetadata = valueView.value.denom
			} else if (valueView?.case === 'unknownDenom') {
				assetId = valueView.value.assetId
			}

			// TODO: may need fixes to view protos
			// TODO: knownDenom only has a denom string, not a denom metadata...

			// TODO: ValueView component?
			const amount = valueView?.value?.amount
			const exponent = denomMetadata
				? denomMetadata?.denomUnits.find(
						i => i.denom === denomMetadata?.display
				  )?.exponent || 1
				: 1

			const humanAmount = calculateAmount(
				Number(amount?.lo),
				Number(amount?.hi),
				exponent
			)

			let humanDenom = denomMetadata
				? denomMetadata.display
				: bech32.encode('passet1', bech32.toWords(assetId?.inner!))

			return (
				<div className='w-[100%] flex flex-col'>
					<p className='h3 mb-[8px] capitalize'>Spend</p>
					<p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
						<span>
							{humanAmount} {humanDenom} from {' '}
						</span>
						<AddressViewComponent addressView={addressView} />
					</p>
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
