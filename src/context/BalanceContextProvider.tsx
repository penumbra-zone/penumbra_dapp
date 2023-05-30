import {
	AssetsRequest,
	AssetsResponse,
	BalanceByAddressRequest,
	BalanceByAddressResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../App'
import { uint8ToBase64 } from '../utils/uint8ToBase64'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { createWebExtTransport } from '../utils/webExtTransport'
import { Denom } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { AssetId } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { Amount } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'

export type AssetBalance = { asset?: AssetId } & { amount?: Amount } & {
	denom?: Denom
}
type StoreState = {
	balance: AssetBalance[]
	assets: AssetsResponse[]
}

const BalanceContext = createContext<StoreState>({
	balance: [],
	assets: [],
})

export const useBalance = () => useContext(BalanceContext)

type Props = {
	children?: React.ReactNode
}

export const BalanceContextProvider = (props: Props) => {
	const auth = useAuth()
	// const [balance, setBalance] = useState<
	// 	Record<string, BalanceByAddressResponse & { denom: { denom: string } }>
	// >({})
	const [balances, setBalances] = useState<BalanceByAddressResponse[]>([])
	const [assets, setAssets] = useState<AssetsResponse[]>([])

	const assetBalance = useMemo(() => {
		return balances
			.map(balance => {
				const id = uint8ToBase64(balance!.asset!.inner)

				const asset = assets.find(
					i => uint8ToBase64(i.asset?.id?.inner as Uint8Array) === id
				)?.asset

				return {
					...balance,
					denom: asset?.denom,
				}
			})
			.filter(balance => balance.amount?.lo)
	}, [balances, assets])

	useEffect(() => {
		if (!auth.user) return
		const getAssets = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				createWebExtTransport(ViewProtocolService)
			)

			const assetsRequest = new AssetsRequest({})

			for await (const asset of client.assets(assetsRequest)) {
				setAssets(state => [...state, asset])
			}
		}
		getAssets()
	}, [auth])

	useEffect(() => {
		if (!auth.user) return
		const getBalances = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				createWebExtTransport(ViewProtocolService)
			)

			const request = new BalanceByAddressRequest({})

			for await (const balance of client.balanceByAddress(request)) {
				setBalances(balances => [...balances, balance])
			}
		}
		getBalances()
	}, [auth])
	return (
		<BalanceContext.Provider value={{ balance: assetBalance, assets }}>
			{props.children}
		</BalanceContext.Provider>
	)
}
