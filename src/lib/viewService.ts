import { createViewServiceClient } from './extensionTransport'
import { StatusStreamRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'

const getPercentage = (partialValue: number, totalValue: number): number => {
	if (!totalValue) return 0
	return Math.round((100 * partialValue) / totalValue)
}

export async function getSyncPercent(
	action: React.Dispatch<React.SetStateAction<number>>
) {
	const client = createViewServiceClient()
	const statusRequest = new StatusStreamRequest({})

	for await (const status of client.statusStream(statusRequest)) {
		action(
			getPercentage(
				Number(status.syncHeight),
				Number(status.latestKnownBlockHeight)
			)
		)
	}
}
