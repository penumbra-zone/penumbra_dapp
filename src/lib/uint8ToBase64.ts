
export const uint8ToBase64 = (arr: Uint8Array): string =>
	btoa(
		Array(arr.length)
			.fill('')
			.map((_, i) => String.fromCharCode(arr[i]))
			.join('')
	)

export const base64toUint8 = (base64Str: string): Uint8Array =>
    Uint8Array.from(atob(base64Str), c => c.charCodeAt(0))

