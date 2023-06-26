interface ISvgProps {
	width?: string
	height?: string
	stroke?: string
	fill?: string
}
export const DowmloadSvg = (props: ISvgProps) => {
	return (
		<svg
			width={props.width || '24'}
			height={props.height || '24'}
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15'
				stroke={props.stroke || 'white'}
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M7 10L12 15L17 10'
				stroke={props.stroke || 'white'}
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M12 15V3'
				stroke={props.stroke || 'white'}
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

export const ArrowUpRightSvg = () => {
	return (
		<svg
			width='25'
			height='24'
			viewBox='0 0 25 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M7.5 17L17.5 7'
				stroke='white'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M7.5 7H17.5V17'
				stroke='white'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

export const CachedSvg = () => {
	return (
		<svg
			width='25'
			height='24'
			viewBox='0 0 25 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M19.5 8L15.5 12H18.5C18.5 13.5913 17.8679 15.1174 16.7426 16.2426C15.6174 17.3679 14.0913 18 12.5 18C11.5 18 10.53 17.75 9.7 17.3L8.24 18.76C9.47 19.54 10.93 20 12.5 20C14.6217 20 16.6566 19.1571 18.1569 17.6569C19.6571 16.1566 20.5 14.1217 20.5 12H23.5M6.5 12C6.5 10.4087 7.13214 8.88258 8.25736 7.75736C9.38258 6.63214 10.9087 6 12.5 6C13.5 6 14.47 6.25 15.3 6.7L16.76 5.24C15.53 4.46 14.07 4 12.5 4C10.3783 4 8.34344 4.84285 6.84315 6.34315C5.34285 7.84344 4.5 9.87827 4.5 12H1.5L5.5 16L9.5 12'
				fill='white'
			/>
		</svg>
	)
}

export const CopySvg = (props: ISvgProps) => {
	return (
		<svg
			width={props.width || '12'}
			height={props.height || '12'}
			viewBox='0 0 12 12'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M9.5 10.5H4V3.5H9.5M9.5 2.5H4C3.73478 2.5 3.48043 2.60536 3.29289 2.79289C3.10536 2.98043 3 3.23478 3 3.5V10.5C3 10.7652 3.10536 11.0196 3.29289 11.2071C3.48043 11.3946 3.73478 11.5 4 11.5H9.5C9.76522 11.5 10.0196 11.3946 10.2071 11.2071C10.3946 11.0196 10.5 10.7652 10.5 10.5V3.5C10.5 3.23478 10.3946 2.98043 10.2071 2.79289C10.0196 2.60536 9.76522 2.5 9.5 2.5ZM8 0.5H2C1.73478 0.5 1.48043 0.605357 1.29289 0.792893C1.10536 0.98043 1 1.23478 1 1.5V8.5H2V1.5H8V0.5Z'
				fill={props.fill || 'white'}
			/>
		</svg>
	)
}

export const CloseSvg = (props: ISvgProps) => {
	return (
		<svg
			width={props.width || '12'}
			height={props.height || '12'}
			viewBox='0 0 12 12'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M9.5 3.205L8.795 2.5L6 5.295L3.205 2.5L2.5 3.205L5.295 6L2.5 8.795L3.205 9.5L6 6.705L8.795 9.5L9.5 8.795L6.705 6L9.5 3.205Z'
				fill={props.fill || '#870606'}
			/>
		</svg>
	)
}

export const ChevronLeftIcon = (props: ISvgProps) => {
	return (
		<svg
			width={props.width || '24'}
			height={props.height || '24'}
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M15 18L9 12L15 6'
				stroke={props.stroke || 'white'}
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	)
}

export const SearchSvg = () => {
	return (
		<svg
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M9.5 3C11.2239 3 12.8772 3.68482 14.0962 4.90381C15.3152 6.12279 16 7.77609 16 9.5C16 11.11 15.41 12.59 14.44 13.73L14.71 14H15.5L20.5 19L19 20.5L14 15.5V14.71L13.73 14.44C12.59 15.41 11.11 16 9.5 16C7.77609 16 6.12279 15.3152 4.90381 14.0962C3.68482 12.8772 3 11.2239 3 9.5C3 7.77609 3.68482 6.12279 4.90381 4.90381C6.12279 3.68482 7.77609 3 9.5 3M9.5 5C7 5 5 7 5 9.5C5 12 7 14 9.5 14C12 14 14 12 14 9.5C14 7 12 5 9.5 5Z'
				fill='#E0E0E0'
			/>
		</svg>
	)
}
