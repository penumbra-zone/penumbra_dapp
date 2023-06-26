import { TransactionView } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'

enum TransactionType {
	Unknown = 'Unknown',
	Send = 'Send',
	Delegate = 'Delegate',
	Undelegate = 'Undelegate',
	SubmitProposal = 'Submit Proposal',
	WithdrawProposal = 'Withdraw Proposal',
	OpenPosition = 'Open Position',
	ClosePosition = 'Close Position',
	WithdrawPosition = 'Withdraw Position',
	InternalSend = 'Internal',
	Swap = 'Swap',
}

export const getTransactionType = (txv: TransactionView | undefined) => {
	if (!txv) return TransactionType.Unknown

	const actions = txv.bodyView?.actionViews

	if (!actions) return TransactionType.Unknown

	if (actions?.length < 2) {
		return TransactionType.Unknown
	}

	if (actions.find(e => e.actionView.case === 'proposalWithdraw'))
		return TransactionType.WithdrawProposal

	if (actions.find(e => e.actionView.case === 'proposalSubmit'))
		return TransactionType.SubmitProposal

	if (actions.find(e => e.actionView.case === 'positionOpen'))
		return TransactionType.OpenPosition

	if (actions.find(e => e.actionView.case === 'positionClose'))
		return TransactionType.ClosePosition

	if (actions.find(e => e.actionView.case === 'positionWithdraw'))
		return TransactionType.WithdrawPosition

	if (actions.find(e => e.actionView.case === 'delegate'))
		return TransactionType.Delegate

	if (actions.find(e => e.actionView.case === 'undelegate'))
		return TransactionType.Undelegate

	if (actions.find(e => e.actionView.case === 'swap'))
		return TransactionType.Swap

	if (actions?.length === 2) {
		if (
			actions.find(e => e.actionView.case === 'output') &&
			actions.find(e => e.actionView.case === 'spend')
		) {
			if (
				actions.find(
					e =>
						e.actionView.case === 'output' &&
						e.actionView.value.outputView.case === 'visible' &&
						e.actionView.value.outputView.value.note?.address?.addressView
							.case === 'visible'
				)
			) {
				return TransactionType.InternalSend
			} else {
				return TransactionType.Send
			}
		}
	}
	if (actions?.length === 3) {
	}

	return TransactionType.Unknown
}
