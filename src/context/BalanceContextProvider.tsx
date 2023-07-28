'use client'
import {
	AssetsRequest,
	AssetsResponse,
	BalancesRequest,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import {
	AssetId,
	Value,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { useAuth } from './AuthContextProvider'
import { calculateAmount, extensionTransport, uint8ToBase64 } from '@/lib'

export type AssetBalance = {
	assetId?: AssetId
	display: string
	base: string
	exponent: number
	amount: number
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
	const [balance, setBalance] = useState<Record<string, Value>>({})
	const [assets, setAssets] = useState<AssetsResponse[]>([])

	const assetBalance: AssetBalance[] = useMemo(() => {
		const detailAssets = Object.entries(balance).map(i => {
			const asset = assets.find(j => {
				return uint8ToBase64(j.denomMetadata?.penumbraAssetId?.inner!) === i[0]
			})

			const exponent = Number(
				asset?.denomMetadata?.denomUnits.find(
					i => i.denom === asset.denomMetadata?.display
				)?.exponent
			)

			const amount = calculateAmount(
				Number(i[1].amount?.lo),
				Number(i[1].amount?.hi),
				exponent
			)

			return {
				[i[0]]: {
					...i[1],
					display: asset?.denomMetadata?.display || '',
					base: asset?.denomMetadata?.base || '',
					exponent,
					amount,
				},
			}
		})

		return detailAssets
			.map(i => Object.values(i)[0])
			.filter(i => Number(i.amount))
	}, [balance, assets])

	console.log(assetBalance)

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
	}, [auth.walletAddress])

	useEffect(() => {
		if (!auth!.walletAddress) return setBalance({})
		const getBalances = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)

			const request = new BalancesRequest({})

			for await (const balance of client.balances(request)) {
				const asset = uint8ToBase64(balance.balance?.assetId?.inner!)

				setBalance(state => ({
					...state,
					[asset]: balance.balance!,
				}))
			}
		}
		getBalances()
	}, [auth.walletAddress])

	return (
		<BalanceContext.Provider value={{ balance: assetBalance, assets }}>
			{props.children}
		</BalanceContext.Provider>
	)
}
