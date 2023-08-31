'use client'

import { useBalance } from '@/context'
import {
	AddressValidatorsType,
	setOnlyNumberInput,
	validateAddress,
} from '@/lib'
import { useState } from 'react'

type PrepareTransactionValues = {
	reciever?: string
	amount: string
	memo?: string
	hideAddress?: boolean
	asset1: string
	asset2?: string
}

const initState = {
	reciever: undefined,
	amount: '',
	memo: undefined,
	hideAddress: undefined,
	asset1: '',
	//TODO delete penumbra after query swap pairs
	asset2: 'penumbra',
}

export const useTransactionValues = () => {
	const { balance } = useBalance()

	const [values, setValues] = useState<PrepareTransactionValues>(initState)

	const [isValidate, setIsValidate] = useState<AddressValidatorsType>(
		{} as AddressValidatorsType
	)

	const clearState = () => {
		setValues(initState)
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
			switch (type) {
				case 'reciever': {
					setValues(state => ({
						...state,
						[type]: event.target.value,
					}))
					const validators = validateAddress(event.target.value)
					setIsValidate(state => ({
						...state,
						...validators,
					}))
				}
				case 'amount': {
					const { value, notShow, valueFloat } = setOnlyNumberInput(
						event.target.value
					)
					if (isNaN(valueFloat) || notShow) return
					setValues(state => ({
						...state,
						[type]: value,
					}))
				}
				default: {
					setValues(state => ({
						...state,
						[type]: event.target.value,
					}))
				}
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

	return {
		values,
		isValidate,
		handleChangeSelect,
		handleChangeInput,
		handleMax,
		clearState,
		handleCheck,
	}
}
