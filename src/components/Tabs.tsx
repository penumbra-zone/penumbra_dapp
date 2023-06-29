import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type TabsProps = {
	tabs: string[]
	children: any
	className?: string
	initial?: string | null
}

export const Tabs: React.FC<TabsProps> = ({
	tabs,
	children,
	className = 'bg-[#000000]',
	initial,
}) => {
	const params = useSearchParams()
	const [activeTab, setActivetab] = useState<string>(initial || tabs[0])

	useEffect(() => {
		if (!params.get('tab')) return
		if (activeTab !== params.get('tab')) {
			window.history.replaceState(null, '', '/')
		}
	}, [params, activeTab])

	const handleChangeTab = (tab: string) => () => setActivetab(tab)

	return (
		<div className='w-[100%] flex flex-col mt-[16px] '>
			<div className='flex'>
				{tabs.map(i => {
					return (
						<div
							key={i}
							role='button'
							tabIndex={0}
							className={`w-[50%] h-[52px] text-center text_button cursor-pointer ${
								activeTab === i
									? 'border-b-[1px] border-solid border-[rgba(139,228,217,0.70)]'
									: 'border-b-[1px] border-solid border-dark_grey'
							}`}
							onClick={handleChangeTab(i)}
						>
							<p
								className={`h-[51px] flex items-center justify-center ${
									activeTab === i ? 'text-white' : 'text-light_brown'
								} text_button ${className}`}
							>
								{i}
							</p>
						</div>
					)
				})}
			</div>
			{children(activeTab)}
		</div>
	)
}
