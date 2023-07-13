import React from 'react'
import { EncryptedSvg } from './Svg'

type ActionCellProps = {
	title: string
	children?: React.ReactNode
	isEncrypted?: boolean
}

export const ActionCell: React.FC<ActionCellProps> = ({
	title,
	isEncrypted,
	children,
}) => {
	return (
		<div className='w-[100%] flex flex-col'>
			{isEncrypted ? (
				<div className='flex items-center gap-x-[8px]'>
					<EncryptedSvg />
					<p className='text-light_brown'>{`${title} (Encrypted)`}</p>
				</div>
			) : (
				<>
					<p className='h3 mb-[8px] capitalize'>{title}</p>
					<div className='py-[8px] px-[16px] bg-dark_grey rounded-[10px] text_numbers_s text-light_grey break-words min-h-[44px]'>
						{children}
					</div>
				</>
			)}
		</div>
	)
}
