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
		<div className='w-[100%] flex flex-col '>
			<div className='flex mb-[24px]'>
				{tabs.map(i => {
					return (
						<div
							key={i}
							role='button'
							tabIndex={0}
							className={`w-[50%] h-[52px] text-center text_button cursor-pointer ${
								activeTab === i
									? 'tab_gradient'
									: 'border-b-[1px] border-solid border-dark_grey'
							}`}
							onClick={handleChangeTab(i)}
						>
							<p
								className={`h-[51px] flex items-center justify-center text-light_grey ${className}`}
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
