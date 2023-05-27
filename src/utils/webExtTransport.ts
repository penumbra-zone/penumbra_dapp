import { createRouterTransport } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import {
	AssetsRequest,
	AssetsResponse,
	BalanceByAddressRequest,
	BalanceByAddressResponse,
	StatusRequest,
	StatusResponse,
	StatusStreamRequest,
	StatusStreamResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'

export const createWebExtTransport = (s: typeof ViewProtocolService) =>
	createRouterTransport(({ service }) => {
		service(s, {
			status: async (message: StatusRequest) => {
				const response = await window.penumbra.getStatus()

				return new StatusResponse(response)
			},
			async *statusStream(message: StatusStreamRequest) {
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
				window.penumbra.on('status', status => receiveMessage(status))

				for await (const res of createMessageStream()) {
					yield new StatusStreamResponse(res as any)
				}
			},
			async *assets(message: AssetsRequest) {
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
				window.penumbra.on('assets', asset => receiveMessage(asset))
				for await (const res of createMessageStream()) {
					yield new AssetsResponse(res as any)
				}
			},
			async *balanceByAddress(message: BalanceByAddressRequest) {
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
				window.penumbra.on('balance', balance => receiveMessage(balance))
				for await (const res of createMessageStream()) {
					yield new BalanceByAddressResponse(res as any)
				}
			},
		})
	})
