"use client"

import React from 'react'
import { CopySvg } from '../Svg'
import { copyToClipboard, truncateHash } from '@/lib'

// A transaction hash, optionally in short form, with a copy button
export const TransactionHashComponent: React.FC<{
	hash: string
	shortForm?: boolean
}> = ({ hash, shortForm }) => {
	const displayHash = shortForm ? truncateHash(hash, 8) : hash

	const handleCopy = () => copyToClipboard(hash)

	return (
		<div style={{ display: 'inline-block' }}>
			<span className='monospace'>{displayHash}</span>
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
