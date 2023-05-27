import React from 'react'
import {
	AssetsRequest,
	AssetsResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useEffect, useState } from 'react'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { createWebExtTransport } from '../../utils/webExtTransport'

export const Assets = () => {
	const [res, setRes] = useState<AssetsResponse[]>([])

	useEffect(() => {
		const getAssets = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				createWebExtTransport(ViewProtocolService)
			)

			const assetsRequest = new AssetsRequest({})

			for await (const asset of client.assets(assetsRequest)) {
				setRes(state => [...state, asset])
			}
		}
		getAssets()
		
	}, [])

	return (
		<div className='w-[100%] flex flex-col bg-brown rounded-[15px] px-[24px] py-[12px] text_body break-words'>
			{JSON.stringify(res)}
		</div>
	)
}
