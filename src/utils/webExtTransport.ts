import { createRouterTransport } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import {
	AssetsRequest,
	AssetsResponse,
	BalanceByAddressRequest,
	BalanceByAddressResponse,
	ChainParametersRequest,
	ChainParametersResponse,
	FMDParametersRequest,
	FMDParametersResponse,
	NotesRequest,
	NotesResponse,
	StatusRequest,
	StatusResponse,
	StatusStreamRequest,
	StatusStreamResponse,
	TransactionInfoRequest,
	TransactionInfoResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'

export const createWebExtTransport = (s: typeof ViewProtocolService) =>
	createRouterTransport(({ service }) => {
		let receiveMessage: (value: unknown) => void = function () {}
		function waitForNextMessage() {
			return new Promise(resolve => {
				receiveMessage = resolve
			})
		}
		async function* createMessageStream() {
			while (true) {
				yield waitForNextMessage()
			}
		}
		service(s, {
			status: async (message: StatusRequest) => {
				const response = await window.penumbra.getStatus()

				return new StatusResponse(response)
			},
			fMDParameters: async (message: FMDParametersRequest) => {
				const response = await window.penumbra.getFmdParameters()

				return new FMDParametersResponse(response)
			},
			chainParameters: async (message: ChainParametersRequest) => {
				const response = await window.penumbra.getChainParameters()

				return new ChainParametersResponse(response)
			},
			async *statusStream(message: StatusStreamRequest) {
				window.penumbra.on('status', status => receiveMessage(status))

				for await (const res of createMessageStream()) {
					yield new StatusStreamResponse(res as StatusStreamResponse)
				}
			},
			async *assets(message: AssetsRequest) {
				window.penumbra.on('assets', asset => receiveMessage(asset))

				for await (const res of createMessageStream()) {
					yield new AssetsResponse(res as any)
				}
			},
			async *balanceByAddress(message: BalanceByAddressRequest) {
				window.penumbra.on('balance', balance => receiveMessage(balance))

				for await (const res of createMessageStream()) {
					yield new BalanceByAddressResponse(res as any)
				}
			},
			async *notes(message: NotesRequest) {
				window.penumbra.on('notes', note => receiveMessage(note))

				for await (const res of createMessageStream()) {
					yield new NotesResponse(res as any)
				}
			},
			async *transactionInfo(message: TransactionInfoRequest) {
				window.penumbra.on('transactions', tx => receiveMessage(tx), message.toJson())

				

				for await (const res of createMessageStream()) {
					yield new TransactionInfoResponse(res as any)
				}
			},
		})
	})
