import React, { useEffect, useState } from 'react'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { AddressByIndexRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { extensionTransport } from '@/lib/extensionTransport'
import { ModalProps, ModalWrapper } from './ModalWrapper'
import { Copy } from './Copy'

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

	return (
		<ModalWrapper show={show} onClose={onClose}>
			<div className='relative overflow-y-auto pt-[22px] pb-[90px] px-[16px]'>
				<p className='h3 mb-[8px]'>Address 1</p>
				<div className='flex p-[10px] justify-center items-center gap-[8px] rounded-[10px] bg-dark_grey text_body text-light_grey'>
					<Copy text={address} type='full' />
				</div>
			</div>
		</ModalWrapper>
	)
}
