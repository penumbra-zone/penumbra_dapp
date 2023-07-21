"use client"

import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { CloseSvg } from './Svg'

export type ModalProps = { show: boolean; onClose: () => void }

type ModalWrapperPropsType = {
	show: boolean
	onClose?: () => void
	className?: string
	children: React.ReactElement
	position?: 'center' | 'top_right'
}

export const ModalWrapper: React.FC<ModalWrapperPropsType> = ({
	show,
	onClose,
	children,
}) => {
	const [_document, setDocument] = useState<Document | null>(null)

	useEffect(() => {
		setDocument(document)
	}, [])

	const stopPropagation = (e: React.MouseEvent<HTMLElement>) =>
		e.stopPropagation()

	const modalContent = show ? (
		<div
			data-te-modal-init
			className='fixed left-0 top-0 z-[1055]  h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-background-0.7'
			id='exampleModalScrollable'
			tabIndex={-1}
			aria-labelledby='exampleModalScrollableLabel'
			aria-hidden='true'
			onClick={onClose}
		>
			<div
				data-te-modal-dialog-ref
				className='pointer-events-none relative flex items-center w-auto translate-y-[-50px]  transition-all duration-300 ease-in-out mx-auto mt-7 h-[calc(100%-3.5rem)] max-w-[500px]'
				onClick={stopPropagation}
			>
				<div className='pointer-events-auto  flex max-h-[75vh] w-full flex-col overflow-hidden rounded-[10px] bg-brown outline-none'>
					<div className='flex items-center justify-between p-[16px] border-b-[1px] border-dark_grey'>
						<p className='h2'>Receive</p>
						<button
							type='button'
							className='box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none'
							data-te-modal-dismiss
							aria-label='Close'
							onClick={onClose}
						>
							<CloseSvg width='24' height='24' fill='#E0E0E0' />
						</button>
					</div>

					{/* <!--Modal body--> */}
					{children}

					{/* <!--Modal footer--> */}
					{/* <div
					className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
					<button
						type="button"
						className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
						data-te-modal-dismiss
						data-te-ripple-init
						data-te-ripple-color="light">
						Close
					</button>
					<button
						type="button"
						className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
						data-te-ripple-init
						data-te-ripple-color="light">
						Save changes
					</button>
				</div> */}
				</div>
			</div>
		</div>
	) : null

	if (_document) {
		return ReactDOM.createPortal(
			modalContent,
			_document.getElementById('app-modal')!
		)
	} else {
		return null
	}
}
