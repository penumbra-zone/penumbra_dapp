import {
	AssetsResponse,
	BalanceByAddressResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../App'
import { uint8ToBase64 } from '../utils/uint8ToBase64'

export type AssetBalance = Record<
	string,
	BalanceByAddressResponse & { denom: { denom: string } }
>
type StoreState = {
	balance: AssetBalance
	assets: AssetsResponse[]
}

const BalanceContext = createContext<StoreState>({
	balance: {},
	assets: [],
})

export const useBalance = () => useContext(BalanceContext)

type Props = {
	children?: React.ReactNode
}

export const BalanceContextProvider = (props: Props) => {
	const auth = useAuth()
	const [balance, setBalance] = useState<
		Record<string, BalanceByAddressResponse & { denom: { denom: string } }>
	>({})
	const [assets, setAssets] = useState<AssetsResponse[]>([])

	useEffect(() => {
		if (!auth.user) return
		window.penumbra.on('assets', asset => {
			setAssets(state => [...state, asset])
		})
	}, [auth])

	useEffect(() => {
		if (!assets.length) return

		window.penumbra.on('balance', balance => {
			const id = uint8ToBase64(balance.asset.inner)
			const asset = assets.find(
				i => uint8ToBase64(i.asset?.id?.inner as Uint8Array) === id
			)?.asset

			setBalance(state => ({
				...state,
				[id]: { ...balance, denom: asset?.denom },
			}))
		})
	}, [assets])
	return (
		<BalanceContext.Provider value={{ balance, assets }}>
			{props.children}
		</BalanceContext.Provider>
	)
}
