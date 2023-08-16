import { TransactionPlan } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/transaction/v1alpha1/transaction_pb'
import {
	AddressByIndexRequest,
	AddressByIndexResponse,
	AssetsRequest,
	AssetsResponse,
	ChainParametersRequest,
	ChainParametersResponse,
	EphemeralAddressRequest,
	EphemeralAddressResponse,
	FMDParametersRequest,
	FMDParametersResponse,
	NotesRequest,
	StatusRequest,
	StatusResponse,
	TransactionInfoByHashRequest,
	TransactionInfoByHashResponse,
	TransactionPlannerRequest,
	TransactionPlannerResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'

declare global {
	interface Window {
		penumbra: Penumbra.PenumbraApi
	}
}

export declare namespace Penumbra {
	type PenumbraApi = {
		/**
		 * If a website is trusted, Penumbra public data are returned.
		 */
		requestAccounts(): Promise<[string]>

		/**
		 * Allows subscribing to Waves Keeper events.
		 * If a website is not trusted, events won't show.
		 * @param event
		 * Supports events:
		 * update – subscribe to updates of the state
		 * @param cb
		 */
		on(event: Events, cb: (state: any) => any, args?: any): object

		getChainParameters(
			request?: ChainParametersRequest
		): Promise<ChainParametersResponse>

		getStatus(request?: StatusRequest): Promise<StatusResponse>
		getFmdParameters(
			request?: FMDParametersRequest
		): Promise<FMDParametersResponse>

		signTransaction: (data: any) => Promise<TransactionResponse>

		getTransactionInfoByHash: (
			request: TransactionInfoByHashRequest
		) => Promise<TransactionInfoByHashResponse>
		getAddressByIndex: (
			request: AddressByIndexRequest
		) => Promise<AddressByIndexResponse>
		getTransactionPlanner: (
			request: TransactionPlannerRequest
		) => Promise<TransactionPlannerResponse>
		getEphemeralAddress: (
			request: EphemeralAddressRequest
		) => Promise<EphemeralAddressResponse>
	}
}

export type TransactionResponse = {
	id: number
	jsonrpc: string
	result: {
		code: 1 | 0
		codespace: string
		data: string
		hash: string
		log: string
	}
}

export type Events =
	| 'state'
	| 'status'
	| 'balance'
	| 'assets'
	| 'transactions'
	| 'notes'
	| 'accountsChanged'

export {}
