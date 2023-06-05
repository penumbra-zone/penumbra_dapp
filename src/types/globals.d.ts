import {
	AssetsRequest,
	ChainParametersRequest,
	ChainParametersResponse,
	FMDParametersRequest,
	FMDParametersResponse,
	NotesRequest,
	StatusRequest,
	StatusResponse,
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
		requestAccounts(): Promise<string[]>

		/**
		 * On initialize window.penumbra has no api methods.
		 * You can use penumbra.initialPromise for waiting end initializing api
		 */
		initialPromise: Promise<any>

		/**
		 * Allows subscribing to Waves Keeper events.
		 * If a website is not trusted, events won't show.
		 * @param event
		 * Supports events:
		 * update – subscribe to updates of the state
		 * @param cb
		 */
		on(event: any, cb: (state: any) => any, args?: any): object

		getAssets(request?: AssetsRequest): Promise<object[]>
		getChainParameters(
			request?: ChainParametersRequest
		): Promise<ChainParametersResponse>
		getNotes(request?: NotesRequest): Promise<object[]>
		getNoteByCommitment(request: object): Promise<object>
		getStatus(request?: StatusRequest): Promise<StatusResponse>
		getTransactions(request?: object): Promise<object[]>
		getFmdParameters(
			request?: FMDParametersRequest
		): Promise<FMDParametersResponse>
		getBalanceByAddress: (request?: { address: string }) => Promise<any>
		signTransaction: (data: any) => Promise<TransactionResponse>
		getFullViewingKey: () => Promise<string>
	}

	interface PublicStateResponse {
		initialized: boolean
		locked: boolean
		account: PublicStateAccount | null
	}

	type PublicStateAccount = {
		name: string
		addressByIndex: string
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

export {}
