import { ActionView } from "@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb";
import { SpendViewComponent } from "./SpendView";
import { OutputViewComponent } from "./OutputView";


export const ActionViewComponent: React.FC<{ actionView: ActionView }> = ({ actionView }) => {
    switch (actionView.actionView.case) {
        case 'spend':
            return <SpendViewComponent view={actionView.actionView.value} />;
        case 'output':
            return <OutputViewComponent view={actionView.actionView.value} />;
        // TODO: add a component for each action type (FooViewComponent if view or just FooComponent for actions that are their own views)
        //case 'swap':
        //    return <SwapViewComponent view={actionView.actionView.value} />;
        default:
            return <div className='w-[100%] flex flex-col'>
                <p className='h3 mb-[8px] capitalize'>Unsupported Action {actionView.actionView.case}</p>
            </div>
    }
}
