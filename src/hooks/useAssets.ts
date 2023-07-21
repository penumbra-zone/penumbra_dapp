import { useAuth } from '@/context'
import { extensionTransport } from '@/lib'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import {
	AssetsRequest,
	AssetsResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createPromiseClient } from '@bufbuild/connect'
import { useEffect, useState } from 'react'

export const useAssets = () => {
	const auth = useAuth()

	const [assets, setAssets] = useState<AssetsResponse[]>([])

	useEffect(() => {
		if (!auth!.walletAddress) return setAssets([])
		const getAssets = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)

			const assetsRequest = new AssetsRequest({})

			for await (const asset of client.assets(assetsRequest)) {
				setAssets(state => [...state, asset])
			}
		}
		getAssets()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth.walletAddress])

	return assets
}
