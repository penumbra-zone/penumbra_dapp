import React from 'react'
import { AssetsResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { useEffect, useState } from 'react'

export const Assets = () => {
	const [res, setRes] = useState<AssetsResponse[]>([])

	useEffect(() => {
		window.penumbra.on('assets', asset => {
			setRes(state => [...state, asset])
		})
	}, [])

	return (
		<div className='w-[100%] flex flex-col bg-brown rounded-[15px] px-[24px] py-[12px] text_body break-words'>
			{JSON.stringify(res)}
		</div>
	)
}
