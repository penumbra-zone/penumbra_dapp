import {
	Address,
	AddressView,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/crypto/v1alpha1/crypto_pb'
import { bech32m } from 'bech32'
import React from 'react'
import { CopySvg } from '../Svg'
import { copyToClipboard } from '@/lib'

// A Penumbra address in short form with a copy button
export const AddressComponent: React.FC<{
	address: Address
	show_full?: boolean
}> = ({ address, show_full }) => {
	const prefix = 'penumbrav2t'
	const address_str = bech32m.encode(
		prefix,
		bech32m.toWords(address.inner),
		160
	)
	const address_str_short = address_str.slice(0, prefix.length + 1 + 24) + '…'
	const display_address = show_full ? address_str : address_str_short

	const handleCopy = () => copyToClipboard(address_str)

	return (
		<div style={{ display: 'inline-block' }}>
			<span className='monospace break-all'>{display_address}</span>
			<span
				className='cursor-pointer hover:no-underline hover:opacity-75'
				onClick={handleCopy}
				style={{ display: 'inline-block', margin: '0 5px' }}
			>
				<CopySvg width='1em' height='1em' fill='#524B4B' />
			</span>
		</div>
	)
}

// A Penumbra address in short form with a copy button and info on the account it represents.
export const AddressViewComponent: React.FC<{ addressView: AddressView }> = ({
	addressView,
}) => {
	const address = addressView.addressView.value?.address!

	switch (addressView.addressView.case) {
		case 'visible':
			const view = addressView.addressView.value
			const account = view.index?.account || 0
			return (
				<>
					<AddressComponent address={address} />
					{account === 0 ? (
						<span>(Self)</span>
					) : (
						<span>(Self Account {account})</span>
					)}
				</>
			)
		case 'opaque':
			return <AddressComponent address={address} />
	}
}
