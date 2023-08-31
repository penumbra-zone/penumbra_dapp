import {
	TransactionInfoByHashRequest,
	TransactionInfoByHashResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createViewServiceClient } from './extensionTransport'

export const transactionByHash = async (
	hash: string | null
): Promise<TransactionInfoByHashResponse | null> => {
	if (!hash) return null

	const client = createViewServiceClient()

	const request = new TransactionInfoByHashRequest().fromJson({
		id: {
			hash,
		},
	})

	const tx = await client.transactionInfoByHash(request)

	if (!Object.values(tx.txInfo!).length) return null

	return tx
}
