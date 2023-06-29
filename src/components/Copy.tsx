import { truncateAddress, truncateHash } from '@/lib/text'
import React, { useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { CopySvg } from './Svg'

type CopyProps = {
	text: string
	type: 'last' | 'center' | 'full'
}

export const Copy: React.FC<CopyProps> = ({ text, type }) => {
	const truncateText = useMemo(() => {
		return type === 'center'
			? truncateHash(text)
			: type === 'last'
			? truncateAddress(text)
			: text
	}, [text, type])

	const copyToClipboard = (value: string) => () => {
		navigator.clipboard.writeText(value)
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
		<div className='flex items-center gap-x-[8px]'>
			<p className='break-all'>{truncateText}</p>
			<span
				className='cursor-pointer hover:no-underline hover:opacity-75'
				onClick={copyToClipboard(text)}
			>
				<CopySvg width='16' height='16' fill='#524B4B' />
			</span>
		</div>
	)
}
