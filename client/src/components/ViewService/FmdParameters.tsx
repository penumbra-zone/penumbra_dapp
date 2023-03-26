import { FMDParametersResponse } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import React from 'react'
import { useEffect, useState } from 'react'

export const FmdParameters = () => {
	const [res, setRes] = useState<FMDParametersResponse | null>(null)

	const getData = async () => {
		const data = await window.penumbra.getFmdParameters()

		setRes(data)
	}

	useEffect(() => {
		getData()
	}, [])

	return (
		<div className='w-[100%] flex flex-col bg-brown rounded-[15px] px-[24px] py-[12px] text_body break-words'>
			{JSON.stringify(res)}
		</div>
	)
}
