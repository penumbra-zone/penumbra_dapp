import React from 'react'

interface ToogleProps {
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
}

export const Toogle = ({ label, checked, onChange }: ToogleProps) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.checked)
	}
	return (
		<label className='relative inline-flex items-center cursor-pointer'>
			<input
				type='checkbox'
				checked={checked}
				onChange={handleChange}
				className='sr-only peer'
			/>
			<div className="w-11 h-6 bg-light_brown rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-[rgba(139,228,217,0.6)] peer-checked:to-[rgba(255,144,47,0.5)]"></div>
			<span className='h3 text-white ml-[8px]'>{label}</span>
		</label>
	)
}
