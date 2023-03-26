import React from 'react'
import { useEffect, useState } from 'react'

export const Transactions = () => {
	const [res, setRes] = useState<string>('')

	const getData = () => {
		window.penumbra.on('transactions', data => setRes(data))
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
