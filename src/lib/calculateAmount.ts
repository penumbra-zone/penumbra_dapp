export const calculateAmount = (
	amountLo: number,
	amountHi: number,
	exponent: number
): number => (amountLo + 2 ** 64 * amountHi) / 10 ** exponent
