import { useAuth } from '@/context'
import { useEffect, useState } from 'react'
import { createViewServiceClient } from '@/lib'
import {
	AssetsResponse,
	BalancesRequest,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import {
	AddressIndex,
	DenomMetadata,
	Value,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'

export const useBalance = (asset?: AssetsResponse) => {
	const auth = useAuth()
	const [balance, setBalance] = useState<{
		denomMetadata?: DenomMetadata
		account?: AddressIndex
		balance?: Value
	} | null>(null)

	useEffect(() => {
		if (!auth!.walletAddress) return setBalance(null)
		const getBalances = async () => {
			const client = createViewServiceClient()

			const request = new BalancesRequest({})
			if (asset) {
				request.assetIdFilter = asset.denomMetadata?.penumbraAssetId
			}

			for await (const balance of client.balances(request)) {
				setBalance({ ...balance, ...asset })
			}
		}
		getBalances()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.walletAddress])

	return balance
}
