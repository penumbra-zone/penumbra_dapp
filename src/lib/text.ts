export const truncateAddress = (text: string): string => {
	if (!text) return ''
	return text.slice(0, 35) + '...'
}

export const truncateHash = (
	hash: string | null,
	length: number = 8
): string => {
	if (!hash) return ''

	if (hash.length <= 2 * length) return hash

	return hash.slice(0, length) + '...' + hash.slice(-length)
}
