import { useBalance } from "@/context/BalanceContextProvider";
import { getAssetByAssetId } from "@/lib/assets";
import { uint8ToBase64 } from "@/lib/uint8ToBase64";
import { OutputView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb"
import { AddressComponent } from "../Address";


export const OutputViewComponent: React.FC<{ view: OutputView }> = ({ view }) => {
    // TODO: can the asset info be put in the view correctly instead?
    const { assets } = useBalance()
    console.log(assets)

    switch (view.outputView.case) {
        case 'visible': {
            // view.outputView.value is OutputView_Visible
            const visibleOutput = view.outputView.value;

            const address = visibleOutput.note?.address?.addressView.value?.address!;
            const valueView = visibleOutput.note?.value?.valueView;

            // TODO: handle known/unknown denoms
            // TODO: may need fixes to view protos
            // TODO: knownDenom only has a denom string, not a denom metadata...
            const denomMetadata = getAssetByAssetId(
                assets,
                // this is only OK for now because the extension currently
                // doesn't populate any denom info
                //@ts-ignore
                uint8ToBase64(valueView?.value?.assetId!.inner as Uint8Array)
            )?.denomMetadata

            // TODO: human-formatting an amount should be a helper function
            // TODO: ValueView component?
            const amount = valueView?.value?.amount;
            const exponent = denomMetadata?.denomUnits.find(
                i => i.denom === denomMetadata?.display
            )?.exponent || 1
            const humanAmount =
                (Number(amount?.lo) + 2 ** 64 * Number(amount?.hi)) / (10 ** exponent)

            let humanDenom = denomMetadata?.display /* TODO: || passet1... for unknown denoms */

            return <div className='w-[100%] flex flex-col'>
                <p className='h3 mb-[8px] capitalize'>Output</p>
                <p className='py-[8px] px-[16px] bg-dark_grey rounded-[15px] text_numbers_s text-light_grey break-words '>
                    <span>
                        {humanAmount} {humanDenom} to
                    </span>
                    <AddressComponent address={address} />
                </p>
            </div>
        }
        default: {
            return <div className='w-[100%] flex flex-col'>
                <p className='h3 mb-[8px] capitalize encrypted'>Output</p>
            </div>
        }
    }
}