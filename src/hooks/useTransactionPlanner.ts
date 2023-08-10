'use client'

import { useBalance } from '@/context'
import {
	AddressValidatorsType,
	extensionTransport,
	routesPath,
	setOnlyNumberInput,
	validateAddress,
} from '@/lib'
import { useState } from 'react'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import {
	AddressByIndexRequest,
	EphemeralAddressRequest,
	TransactionPlannerRequest,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { Address } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { bech32m } from 'bech32'
import { useRouter } from 'next/navigation'

type PrepareTransactionValues = {
	reciever?: string
	amount: string
	memo?: string
	hideAddress?: boolean
	asset1: string
	asset2?: string
}

const parseTransactionPlannerByType = (
	type: 'outputs' | 'swaps',
	amount: number,
	selectedAsset: Uint8Array,
	exponent?: number,
	reciever?: string,
	targetAsset?: Uint8Array
) => {
	return {
		[type]: [
			{
				value: {
					amount: {
						lo: BigInt(amount * (exponent ? 10 ** exponent : 1)),
						hi: BigInt(0),
					},
					assetId: { inner: selectedAsset },
				},
				targetAsset:
					type === 'swaps'
						? {
								inner: targetAsset,
						  }
						: undefined,
				fee:
					type === 'swaps'
						? {
								amount: {
									hi: BigInt(0),
									lo: BigInt(0),
								},
						  }
						: undefined,
				address:
					type === 'outputs'
						? {
								inner: bech32m.decode(reciever!, 160).words,
								altBech32m: reciever,
						  }
						: undefined,
			},
		],
	}
}
export const useTransactionPlanner = (transactionType: 'outputs' | 'swaps') => {
	const { balance } = useBalance()
	const { push } = useRouter()

	const [values, setValues] = useState<PrepareTransactionValues>({
		reciever: undefined,
		amount: '',
		memo: undefined,
		hideAddress: undefined,
		asset1: '',
		asset2: 'penumbra',
	})

	const [isValidate, setIsValidate] = useState<AddressValidatorsType>(
		{} as AddressValidatorsType
	)

	const clearState = () => {
		setValues({
			reciever: undefined,
			amount: '',
			memo: undefined,
			hideAddress: undefined,
			asset1: '',
			asset2: 'penumbra',
		})
		setIsValidate({} as AddressValidatorsType)
	}

	const handleChangeSelect = (type: 'asset1' | 'asset2') => (value: string) =>
		setValues(state => ({
			...state,
			[type]: value,
		}))

	const handleChangeInput =
		(type: 'reciever' | 'amount' | 'memo') =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (type === 'amount') {
				const { value, notShow, valueFloat } = setOnlyNumberInput(
					event.target.value
				)
				if (isNaN(valueFloat) || notShow) return
				setValues(state => ({
					...state,
					[type]: value,
				}))
			} else if (type === 'reciever') {
				setValues(state => ({
					...state,
					[type]: event.target.value,
				}))
				const validators = validateAddress(event.target.value)
				setIsValidate(state => ({
					...state,
					...validators,
				}))
				if (!event.target.value) setIsValidate({} as AddressValidatorsType)
			} else {
				setValues(state => ({
					...state,
					[type]: event.target.value,
				}))
			}
		}

	const handleMax = () =>
		setValues(state => ({
			...state,
			amount: String(
				Number(
					values.asset1
						? balance.find(i => i.display === values.asset1)?.amount
						: 0
				)
			),
		}))

	const handleCheck = (checked: boolean) =>
		setValues(state => ({
			...state,
			hideAddress: checked,
		}))

	const sendTransaction = async () => {
		try {
			const asset1 = balance.find(i => i.display === values.asset1)
			console.log(asset1)

			if (!asset1) return

			const selectedAsset2 = balance.find(i => i.display === values.asset2)
				?.assetId?.inner!

			const asset1Exponent = asset1.exponent

			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)

			let address: Address | undefined

			if (values.hideAddress !== undefined) {
				const addressIndex = {
					account: 0,
				}
				if (!values.hideAddress) {
					const request = new AddressByIndexRequest({
						addressIndex,
					})
					const addressByIndex = await client.addressByIndex(request)
					address = addressByIndex.address
				} else {
					const request = new EphemeralAddressRequest({
						addressIndex,
					})

					const ephemeralAddress = await client.ephemeralAddress(request)
					address = ephemeralAddress.address
				}
			}

			const transactionPlan = (
				await client.transactionPlanner(
					new TransactionPlannerRequest({
						memo: values.memo
							? {
									text: values.memo,
									sender: {
										altBech32m: address?.altBech32m,
									},
							  }
							: undefined,
						...parseTransactionPlannerByType(
							transactionType,
							Number(values.amount),
							asset1.assetId?.inner!,
							asset1Exponent,
							values.reciever,
							selectedAsset2
						),
					})
				)
			).plan

			const tx = await window.penumbra.signTransaction(
				transactionPlan?.toJson()
			)

			if (tx.result.code === 0) {
				push(`${routesPath.HOME}?tab=Activity`)
			} else {
				console.log(tx.result)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return {
		values,
		isValidate,
		handleChangeSelect,
		handleChangeInput,
		sendTransaction,
		handleMax,
		clearState,
		handleCheck,
	}
}
