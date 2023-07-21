'use client'
import { Button } from '@/components/Button'
import { MemoViewComponent } from '@/components/MemoViewComponent'
import { ChevronLeftIcon } from '@/components/Svg'
import { TransactionDataComponent } from '@/components/TransactionDataComponent'
import { TransactionHashComponent } from '@/components/penumbra/TransactionHash'
import { ActionViewComponent } from '@/components/penumbra/view/ActionView'
import { useAuth } from '@/context'
import { routesPath, extensionTransport } from '@/lib'
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.bufbuild_connect-es/penumbra/view/v1alpha1/view_connect'
import {
	TransactionInfoByHashRequest,
	TransactionInfoByHashResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'
import { createPromiseClient } from '@bufbuild/connect'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
const DynamicReactJson = dynamic(() => import('@microlink/react-json-view'), {
	ssr: false, // This line is important. It's what prevents server-side rendering.
})

export default function TransactionDetail() {
	const auth = useAuth()
	const { push } = useRouter()
	const params = useSearchParams()

	const [tx, setTx] = useState<TransactionInfoByHashResponse | null>(null)

	useEffect(() => {
		if (!auth!.walletAddress) return
		const getTransaction = async () => {
			const client = createPromiseClient(
				ViewProtocolService,
				extensionTransport(ViewProtocolService)
			)
			const request = new TransactionInfoByHashRequest().fromJson({
				id: {
					hash: params.get('hash'),
				},
			})

			const tx = await client.transactionInfoByHash(request)

			if (!Object.values(tx.txInfo!).length) return
			setTx(tx)
		}
		getTransaction()
	}, [params, auth])

	const handleBack = () => push(`${routesPath.HOME}?tab=Activity`)

	// const rawTx = JSON.parse(tx?.txInfo?.transaction?.toJsonString() || '{}')
	// const rawView = JSON.parse(tx?.txInfo?.view?.toJsonString() || '{}')

	const rawTx = tx?.txInfo?.transaction?.toJson() as object
	const rawView = tx?.txInfo?.view?.toJson() as object

	return (
		<>
			{auth!.walletAddress ? (
				<>
					{tx && (
						<div className='w-[100%] flex justify-center mt-[24px] mb-[40px]'>
							<div className='flex flex-col'>
								<Button
									mode='icon_transparent'
									onClick={handleBack}
									title='Back'
									iconLeft={<ChevronLeftIcon stroke='#E0E0E0' />}
									className='self-start'
								/>
								<div className='h1 mb-[12px] mt-[24px]'>
									<span>Transaction </span>
									<TransactionHashComponent
										hash={params.get('hash') as string}
										shortForm={true}
									/>
									<span>(Height {Number(tx?.txInfo?.height)})</span>
								</div>
								<p className='h2 mb-[12px] mt-[16px]'>Memo</p>

								<MemoViewComponent
									memoView={tx.txInfo!.view!.bodyView!.memoView!}
								/>
								<p className='h2 mb-[12px] mt-[16px]'>Actions</p>
								<div className='flex flex-col p-[16px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
									{tx.txInfo?.view?.bodyView?.actionViews.map(
										(actionView, index) => (
											<ActionViewComponent
												key={index}
												actionView={actionView}
											/>
										)
									)}
								</div>
								<p className='h2 mb-[12px] mt-[16px]'>Transaction Data</p>
								<TransactionDataComponent
									bodyView={tx.txInfo?.view?.bodyView!}
								/>
								<p className='h2 mb-[12px] mt-[16px]'>Raw Transaction</p>
								<div className='flex flex-col p-[16px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
									<div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
										<DynamicReactJson
											src={rawTx}
											theme='twilight'
											name={false}
											displayDataTypes={false}
											collapseStringsAfterLength={48}
											collapsed={true}
											style={{
												fontFamily:
													"'Iosevka', 'Menlo', 'Courier New', Courier, monospace",
												background: '#282626',
												minHeight: '44px',
												borderRadius: '10px',
												padding: '8px 16px',
												display: 'flex',
												alignItems: 'center',
											}}
										/>
									</div>
								</div>
								<p className='h2 mb-[12px] mt-[16px]'>Raw View</p>
								<div className='flex flex-col p-[16px] gap-y-[16px] w-[800px] bg-brown rounded-[10px]'>
									<div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
										<DynamicReactJson
											src={rawView}
											theme='twilight'
											name={false}
											displayDataTypes={false}
											collapseStringsAfterLength={48}
											collapsed={true}
											/* HACK: the component adds inline styles that don't seem easily overridden by normal CSS rules, replicate .monospace here */

											style={{
												fontFamily:
													"'Iosevka', 'Menlo', 'Courier New', Courier, monospace",
												background: '#282626',
												minHeight: '44px',
												borderRadius: '10px',
												padding: '8px 16px',
												display: 'flex',
												alignItems: 'center',
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					)}
				</>
			) : (
				<p className='h2 mt-[300px] text-center'>
					Connect to Penumbra if you want to have access to dApp
				</p>
			)}
		</>
	)
}
