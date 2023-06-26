import React, { useEffect, useState } from 'react'

import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { AddressByIndexRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { extensionTransport } from '@/lib/extensionTransport'
import { toast } from 'react-hot-toast'
import { CopySvg } from './Svg'
import { ModalProps, ModalWrapper } from './ModalWrapper'

export const ReceiveModal: React.FC<ModalProps> = ({ show, onClose }) => {
	const [address, setAddress] = useState<string>('')

	useEffect(() => {
		const getAddressByIndex = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)
			const request = new AddressByIndexRequest({
				addressIndex: {
					account: 0,
				},
			})

			const { address } = await client.addressByIndex(request)

			const { altBech32m } = address?.toJson() as { altBech32m: string }

			setAddress(altBech32m)
		}
		getAddressByIndex()
	}, [])

	const copyToClipboard = () => {
		navigator.clipboard.writeText(address)
		toast.success('Successfully copied', {
			position: 'top-center',
			icon: '👏',
			style: {
				borderRadius: '15px',
				background: '#141212',
				color: '#fff',
			},
		})
	}

	return (
		<ModalWrapper show={show} onClose={onClose}>
			<div className='relative overflow-y-auto pt-[16px] pb-[52px] px-[24px]'>
				<p className='text_numbers_ext text-light_grey mb-[8px]'>Address 1</p>
				<div className='flex p-[10px] justify-center items-center gap-[8px] rounded-[15px] border-[1px] border-light_brown bg-dark_grey'>
					<p className='text_numbers_ext text-light_grey break-all'>
						{address}
					</p>
					<p
						className='cursor-pointer hover:no-underline hover:opacity-75'
						onClick={copyToClipboard}
					>
						<CopySvg width='16' height='16' fill='#524B4B' />
					</p>
				</div>
			</div>
		</ModalWrapper>
	)
}
