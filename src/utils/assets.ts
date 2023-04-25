import { AssetBalance } from '../context'

export const getBalanceByDenom = (
	balance: AssetBalance,
	denom?: string,
	initialDenom = 'KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA='
): string => {
	return (
		Number(
			balance[denom || initialDenom]
				? balance[denom || initialDenom].amount!.lo
				: 0
		) /
		10 ** 6
	).toLocaleString('en-US')
}

export const getAssetDenom = (
	balance: AssetBalance,
	denom?: string,
	initialDenom = 'KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA='
): string => {
	return balance[denom || initialDenom]
		? balance[denom || initialDenom].denom.denom
		: ''
}
