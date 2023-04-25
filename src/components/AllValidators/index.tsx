import { ValidatorInfo } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/stake/v1alpha1/stake_pb'
import { useEffect, useState } from 'react'
import { Input } from '../Input'
import { SearchSvg } from '../Svg'
import { OptionType, SelectInput } from '../Select'
import { ValidatorTable } from '../ValidatorTable'

export type ColumnDefinitionType<T, K extends keyof T> = {
	accessor: K
	Header: string
	sortable: boolean
}

const columnsAllValidator: Array<
	ColumnDefinitionType<
		AllValidatorsTableDataType,
		keyof AllValidatorsTableDataType
	>
> = [
	{
		Header: 'Validator',
		accessor: 'name',
		sortable: false,
	},
	{
		Header: 'Voting Power',
		accessor: 'votingPower',
		sortable: true,
	},
	{
		Header: 'Commission',
		accessor: 'commission',
		sortable: true,
	},
	{
		Header: 'APR',
		accessor: 'arp',
		sortable: true,
	},
	{
		Header: '',
		accessor: 'manage',
		sortable: false,
	},
]

type AllValidatorsProps = {
	validators: ValidatorInfo[]
	denom: string
}

enum ValidatorsState {
	VALIDATOR_STATE_ENUM_UNSPECIFIED = 0,
	VALIDATOR_STATE_ENUM_INACTIVE = 1,
	VALIDATOR_STATE_ENUM_ACTIVE = 2,
	VALIDATOR_STATE_ENUM_JAILED = 3,
	VALIDATOR_STATE_ENUM_TOMBSTONED = 4,
	VALIDATOR_STATE_ENUM_DISABLED = 5,
}

const filterValidator = (validator: ValidatorInfo[], filter: number) =>
	validator.filter(v => v.status!.state!.state === filter)

export type AllValidatorsTableDataType = {
	name: string
	votingPower: string
	commission: number
	arp: number
	state: number
	manage: undefined
	website: string
	description: string
}

const getTableData = (
	validators: ValidatorInfo[]
): AllValidatorsTableDataType[] => {
	return validators.map(i => ({
		name: i.validator!.name,
		votingPower: String(i.status?.votingPower),
		//TODO add commision
		commission: 0,
		arp: 0,
		state: i.status!.state!.state,
		manage: undefined,
		website: i.validator!.website,
		description: i.validator!.description,
	}))
}

export const AllValidators: React.FC<AllValidatorsProps> = ({
	validators,
	denom,
}) => {
	const [search, setSearch] = useState<string>('')
	const [totalValidators, setTotalValidators] = useState<number | null>(null)
	const [tableData, setTableData] = useState<AllValidatorsTableDataType[]>([])
	const [select, setSelect] = useState<number | string>('all')

	// const getValidatorsCount = async () => {
	// 	try {
	// 		const response = await axios.get(
	// 			'http://testnet.penumbra.zone:26657/validators'
	// 		)

	// 		console.log({ response })

	// 		// const data = await response.json()
	// 		// console.log({ data })

	// 		// setTotalValidators(+data.result.total)
	// 	} catch (error) {
	// 		console.log('getValidatorsCount:', error)
	// 	}
	// }

	// useEffect(() => {
	// 	getValidatorsCount()
	// }, [])

	useEffect(() => {
		const validatorTableData = getTableData(validators)
		setTableData(validatorTableData)
	}, [validators])

	const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value)
		const filtered = getTableData(validators).filter(v => {
			return (
				v.name
					.toString()
					.toLowerCase()
					.indexOf(event.target.value.toLowerCase()) > -1
			)
		})

		if (select === 'all') setTableData(filtered)
		else {
			const filterDataBySelect = filtered.filter(v => v.state === select)
			setTableData(filterDataBySelect)
		}
	}

	const options = [
		{
			value: ValidatorsState.VALIDATOR_STATE_ENUM_ACTIVE,
			label: `Active (${
				filterValidator(validators, ValidatorsState.VALIDATOR_STATE_ENUM_ACTIVE)
					.length
			})`,
		},
		{
			value: ValidatorsState.VALIDATOR_STATE_ENUM_UNSPECIFIED,
			label: `Unspecified (${
				filterValidator(
					validators,
					ValidatorsState.VALIDATOR_STATE_ENUM_UNSPECIFIED
				).length
			})`,
		},
		{
			value: ValidatorsState.VALIDATOR_STATE_ENUM_INACTIVE,
			label: `Inactive (${
				filterValidator(
					validators,
					ValidatorsState.VALIDATOR_STATE_ENUM_INACTIVE
				).length
			})`,
		},
		{
			value: ValidatorsState.VALIDATOR_STATE_ENUM_JAILED,
			label: `Jailed (${
				filterValidator(validators, ValidatorsState.VALIDATOR_STATE_ENUM_JAILED)
					.length
			})`,
		},
		{
			value: ValidatorsState.VALIDATOR_STATE_ENUM_TOMBSTONED,
			label: `Tombstoned (${
				filterValidator(
					validators,
					ValidatorsState.VALIDATOR_STATE_ENUM_TOMBSTONED
				).length
			})`,
		},
		{
			value: ValidatorsState.VALIDATOR_STATE_ENUM_DISABLED,
			label: `Disabled (${
				filterValidator(
					validators,
					ValidatorsState.VALIDATOR_STATE_ENUM_DISABLED
				).length
			})`,
		},
		{
			value: 'all',
			label: `All (${validators.length})`,
		},
	]

	const handleChangeSelect = (value: number | string) => {
		setSelect(value)
		const tableData = getTableData(validators)
		if (value === 'all') setTableData(tableData)
		else {
			const filterData = tableData.filter(v => v.state === value)
			setTableData(filterData)
		}
		setSearch('')
	}

	const handleSorting = (
		sortField: keyof AllValidatorsTableDataType,
		sortOrder: string
	) => {
		if (sortField) {
			const sorted = [...tableData].sort(
				(a: AllValidatorsTableDataType, b: AllValidatorsTableDataType) => {
					if (a[sortField] === null) return 1
					if (b[sortField] === null) return -1
					if (a[sortField] === null && b[sortField] === null) return 0
					return (
						a[sortField]!.toString().localeCompare(
							b[sortField]!.toString(),
							'en',
							{
								numeric: true,
							}
						) * (sortOrder === 'asc' ? 1 : -1)
					)
				}
			)
			setTableData(sorted)
		}
	}

	return (
		<div className='flex flex-col mt-[26px]'>
			<div className='flex items-center justify-between mb-[24px]'>
				<Input
					placeholder='Search validators'
					value={search}
					onChange={handleChangeSearch}
					leftSvg={
						<span className='ml-[24px] mr-[9px]'>
							<SearchSvg />
						</span>
					}
					className='w-[400px]'
				/>
				<SelectInput
					options={
						options as OptionType[]
						// totalValidators ===
						// filterValidator(
						// 	validators,
						// 	ValidatorsState.VALIDATOR_STATE_ENUM_ACTIVE
						// ).length
						// 	? (options as OptionType[])
						// 	: []
					}
					handleChange={handleChangeSelect}
					className='w-[192px]'
					initialValue={
						select
						// totalValidators ===
						// filterValidator(
						// 	validators,
						// 	ValidatorsState.VALIDATOR_STATE_ENUM_ACTIVE
						// ).length
						// 	? select
						// 	: undefined
					}
				/>
			</div>
			{filterValidator(validators, ValidatorsState.VALIDATOR_STATE_ENUM_ACTIVE)
				.length ? (
				<>
					{!tableData.length ? (
						<div className=' flex items-center justify-center w-[100%] bg-brown rounded-[15px] h-[400px] text_body text-light_brown'>
							{search
								? `No results were found for "${search}"`
								: 'There are not validators'}
						</div>
					) : (
						<ValidatorTable
							data={tableData}
							handleSorting={handleSorting}
							select={select}
							search={search}
							columns={columnsAllValidator}
							type='all_validator'
							denom={denom}
						/>
					)}
				</>
			) : (
				<></>
			)}
		</div>
	)
}
