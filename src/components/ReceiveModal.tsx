import React, { useEffect, useState } from 'react'
import { createPromiseClient } from '@bufbuild/connect'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import { AddressByIndexRequest } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { extensionTransport } from '@/lib'
import { ModalProps, ModalWrapper } from './ModalWrapper'
import { AddressComponent } from './penumbra/Address'
import { Address } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'

export const ReceiveModal: React.FC<ModalProps> = ({ show, onClose }) => {
	const [address, setAddress] = useState<Address | undefined>()

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
			setAddress(address)
		}
		getAddressByIndex()
	}, [])

	return (
		<ModalWrapper show={show} onClose={onClose}>
			<div className='relative overflow-y-auto pt-[22px] pb-[90px] px-[16px]'>
				<p className='h3 mb-[8px]'>Address 1</p>
				<div className='py-[8px] px-[16px] bg-dark_grey rounded-[10px] text_numbers_s text-light_grey break-words min-h-[44px]'>
					{address && <AddressComponent address={address} show_full />}
				</div>
			</div>
		</ModalWrapper>
	)
}
