import HighlightPathD from '@/components/highlight-path-d'
import { store } from './main'
import { fixNumber } from '@/lib/utils'
import { writeText } from '@/lib/clipboard'
import Checkbox from '@/components/checkbox'
import PointModeSVG from '@/svgs/point-mode.svg'
import ControlModeSVG from '@/svgs/contral-mode.svg'
import { useState } from 'react'
import clsx from 'clsx'
import LLSVG from '@/svgs/point-controls/l-l.svg'
import CLSVG from '@/svgs/point-controls/c-l.svg'
import LCSVG from '@/svgs/point-controls/l-c.svg'
import CCSVG from '@/svgs/point-controls/c-c.svg'
import CCWSVG from '@/svgs/point-controls/c-c-w.svg'
import CCWESVG from '@/svgs/point-controls/c-c-w-e.svg'
import DeleteSVG from '@/svgs/delete.svg'
import dayjs from 'dayjs'
import PreviewD from '@/components/preview-d'
import { jsonToPoints } from '@/lib/storage'

let copyTimer: any = null

export default function AsideDesign() {
	const [copied, setCopied] = useState(false)

	const activePoint = store.activePoint

	return (
		<>
			{activePoint && (
				<section>
					<h3 className='px-3 text-sm'>
						Point{' '}
						<span className='text-xs font-normal text-secondary'>
							({fixNumber(activePoint.x - store.origin[0])}, {fixNumber(activePoint.y - store.origin[1])})
						</span>
					</h3>

					<div className='mt-1.5 flex gap-1'>
						<button
							onClick={() => {
								activePoint.enablePreControl = false
								activePoint.enablePostControl = false
								activePoint.enableControlWeld = false
								activePoint.activate()
							}}
							className={clsx(
								'rounded border p-1 hover:bg-gray-100 active:bg-gray-200',
								!activePoint.enablePreControl && !activePoint.enablePostControl && !activePoint.enableControlWeld && 'text-brand'
							)}>
							<LLSVG className='h-5 w-5' />
						</button>
						<button
							onClick={() => {
								if (!activePoint.enablePreControl) {
									activePoint.enablePreControl = true
									activePoint.initPreControlPoint()
								}
								activePoint.enablePostControl = false
								activePoint.activate()
							}}
							className={clsx(
								'rounded border p-1 hover:bg-gray-100 active:bg-gray-200',
								activePoint.enablePreControl && !activePoint.enablePostControl && !activePoint.enableControlWeld && 'text-brand'
							)}>
							<CLSVG className='h-5 w-5' />
						</button>
						<button
							onClick={() => {
								activePoint.enablePreControl = false
								if (!activePoint.enablePostControl) {
									activePoint.enablePostControl = true
									activePoint.initPostControlPoint()
								}
								activePoint.enableControlWeld = false
								activePoint.activate()
							}}
							className={clsx(
								'rounded border p-1 hover:bg-gray-100 active:bg-gray-200',
								!activePoint.enablePreControl && activePoint.enablePostControl && !activePoint.enableControlWeld && 'text-brand'
							)}>
							<LCSVG className='h-5 w-5' />
						</button>
						<button
							onClick={() => {
								if (!activePoint.enablePreControl) {
									activePoint.enablePreControl = true
									activePoint.initPreControlPoint()
								}
								if (!activePoint.enablePostControl) {
									activePoint.enablePostControl = true
									activePoint.initPostControlPoint()
								}
								activePoint.enableControlWeld = false
								activePoint.activate()
							}}
							className={clsx(
								'rounded border p-1 hover:bg-gray-100 active:bg-gray-200',
								activePoint.enablePreControl && activePoint.enablePostControl && !activePoint.enableControlWeld && 'text-brand'
							)}>
							<CCSVG className='h-5 w-5' />
						</button>
						<button
							onClick={() => {
								if (!activePoint.enablePreControl) {
									activePoint.enablePreControl = true
									activePoint.initPreControlPoint()
								}
								if (!activePoint.enablePostControl) {
									activePoint.enablePostControl = true
									activePoint.initPostControlPoint()
								}
								activePoint.enableControlWeld = true
								activePoint.enableControlEqual = false
								activePoint.syncPostControlPoint()
								activePoint.activate()
							}}
							className={clsx(
								'rounded border p-1 hover:bg-gray-100 active:bg-gray-200',
								activePoint.enablePreControl &&
									activePoint.enablePostControl &&
									activePoint.enableControlWeld &&
									!activePoint.enableControlEqual &&
									'text-brand'
							)}>
							<CCWSVG className='h-5 w-5' />
						</button>
						<button
							onClick={() => {
								if (!activePoint.enablePreControl) {
									activePoint.enablePreControl = true
									activePoint.initPreControlPoint()
								}
								if (!activePoint.enablePostControl) {
									activePoint.enablePostControl = true
									activePoint.initPostControlPoint()
								}
								activePoint.enableControlWeld = true
								activePoint.enableControlEqual = true
								activePoint.syncPostControlPoint()
								activePoint.activate()
							}}
							className={clsx(
								'rounded border p-1 hover:bg-gray-100 active:bg-gray-200',
								activePoint.enablePreControl && activePoint.enablePostControl && activePoint.enableControlWeld && activePoint.enableControlEqual && 'text-brand'
							)}>
							<CCWESVG className='h-5 w-5' />
						</button>

						<button
							onClick={() => {
								activePoint.deleteSelf()
							}}
							className='rounded border p-1 text-red-500 hover:bg-gray-100 active:bg-gray-200'>
							<DeleteSVG className='h-5 w-5' />
						</button>
					</div>
				</section>
			)}

			<section>
				<h3 className='px-3 text-sm'>Path</h3>
				<div className='max-h-[360px] min-h-[120px] overflow-auto break-all rounded-lg bg-gray-100 p-3 text-xs font-normal text-secondary'>
					{store.theD ? <HighlightPathD d={store.theD} /> : 'Click to get path.'}
				</div>
				<div className='mt-1.5 flex gap-1'>
					<button
						className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'
						onClick={() => {
							store.points.forEach(item => {
								item.x = fixNumber(item.x)
								item.y = fixNumber(item.y)
								item.preControlPoint.x = fixNumber(item.preControlPoint.x)
								item.preControlPoint.y = fixNumber(item.preControlPoint.y)
								item.postControlPoint.x = fixNumber(item.postControlPoint.x)
								item.postControlPoint.y = fixNumber(item.postControlPoint.y)
							})
							store.setPoints([...store.points])
						}}>
						Minify
					</button>
					<button
						className={clsx('rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200', copied && 'text-success')}
						onClick={() => {
							clearTimeout(copyTimer)

							writeText(store.theD)
							setCopied(true)

							copyTimer = setTimeout(() => setCopied(false), 3000)
						}}>
						{copied ? 'Copied!' : 'Copy'}
					</button>
					<button
						className='ml-auto rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'
						onClick={() => {
							store.setPoints([])
							store.setMouseMode('create')
						}}>
						Reset
					</button>
				</div>
			</section>

			<section>
				<h3 className='px-3 text-sm'>Shape</h3>
				<div className='mt-3 flex gap-1'>
					<div
						onClick={() => {
							store.points.forEach((item, index) => {
								if (!(!store.closedPath && (index == 0 || index == store.points.length - 1))) item.enablePreControl = true
								item.initPreControlPoint()
								if (!(!store.closedPath && (index == 0 || index == store.points.length - 1))) item.enablePostControl = true
								item.enableControlWeld = true
								item.enableControlEqual = true
								item.syncPostControlPoint()
								item.preControlPoint.x = fixNumber(item.preControlPoint.x)
								item.preControlPoint.y = fixNumber(item.preControlPoint.y)
								item.postControlPoint.x = fixNumber(item.postControlPoint.x)
								item.postControlPoint.y = fixNumber(item.postControlPoint.y)
							})
							store.setPoints([...store.points])
						}}
						className='group cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
						<div className='mx-auto h-3 w-3 rounded-full border-2 border-secondary/80 group-active:border-success' />
						Smooth
					</div>
					<div
						onClick={() => {
							store.points.forEach(item => {
								item.enablePreControl = false
								item.enablePostControl = false
							})
							store.setPoints([...store.points])
						}}
						className='group cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
						<div className='mx-auto h-3 w-3 border-2 border-secondary/80 group-active:border-success' />
						Sharp
					</div>
				</div>
			</section>

			<section>
				<h3 className='px-3 text-sm'>Features</h3>
				<ul className='mt-3 space-y-1 text-sm'>
					<li className='flex items-center rounded-lg bg-gray-100 p-3'>
						<PointModeSVG className='mr-1 h-5 w-5 self-start text-[#999]' />
						<div>
							<div>Point mode</div>
							<div className='text-xs font-normal text-[#999]'>always show point</div>
						</div>
						<Checkbox
							className='ml-auto'
							checked={store.canvasMode == 'point' || store.canvasMode === 'refine'}
							setChecked={(bool: boolean) => {
								if (bool) {
									store.setCanvasMode('point')
								} else {
									store.setCanvasMode('normal')
								}
							}}
						/>
					</li>
					<li className='flex items-center rounded-lg bg-gray-100 p-3'>
						<ControlModeSVG className='mr-1 h-5 w-5 self-start text-[#999]' />
						<div>
							<div>Control mode</div>
							<div className='text-xs font-normal text-[#999]'>always show controls</div>
						</div>
						<Checkbox
							className='ml-auto'
							checked={store.canvasMode === 'refine'}
							setChecked={(bool: boolean) => {
								if (bool) {
									store.setCanvasMode('refine')
								} else {
									store.setCanvasMode('point')
								}
							}}
						/>
					</li>
					<li className='flex items-center rounded-lg bg-gray-100 p-3'>
						<div className='mr-1 flex h-5 w-5 items-center justify-center self-start text-lg text-[#999]'>z</div>
						<div>
							<div>Close path</div>
							<div className='text-xs font-normal text-[#999]'>better than z</div>
						</div>
						<Checkbox className='ml-auto' checked={store.closedPath} setChecked={store.setClosedPath} />
					</li>
					<li className='flex items-center rounded-lg bg-gray-100 p-3'>
						<div className='mr-1 flex h-5 w-5 items-center justify-center self-start text-lg text-[#999]'>^</div>
						<div>
							<div>Arrow head</div>
							<div className='text-xs font-normal text-[#999]'>indicating arrow</div>
						</div>
						<Checkbox className='ml-auto' checked={store.showArrow} setChecked={store.setShowArrow} />
					</li>
				</ul>
			</section>

			{store.records.length > 0 && (
				<section>
					<h3 className='px-3 text-sm'>Records</h3>

					<ul className='mt-3 space-y-1 text-sm'>
						{store.records.map((item, i) => (
							<li key={item.uid} className='flex items-center rounded-lg bg-gray-100 p-3'>
								<div className='mr-3 flex h-8 w-10 shrink-0 items-center justify-center rounded border bg-white'>
									<PreviewD d={item.theD} />
								</div>
								<div>
									<div className='max-w-[100px] overflow-hidden text-ellipsis text-sm'>{item.name}</div>
									<div className='text-xs font-normal text-secondary'>{dayjs(item.timestamp).format('HH:mm MM/D/YY')}</div>
								</div>
								<div className='ml-auto flex w-[60px] flex-col gap-0.5 text-center text-xs font-normal'>
									<button
										onClick={() => {
											store.uid = item.uid
											store.name = item.name
											store.closedPath = item.closedPath

											store.setPoints(jsonToPoints(item.points) || [])
											const [record] = store.records.splice(i, 1)
											store.setRecords([record, ...store.records])
										}}
										className='w-full rounded border bg-gray-50 py-0.5 hover:bg-gray-100 active:bg-gray-200'>
										Apply
									</button>
									<button
										onClick={() => {
											store.records.splice(i, 1)
											store.setRecords(s => [...store.records])
										}}
										className='w-full rounded border bg-gray-50 py-0.5 hover:bg-gray-100 active:bg-gray-200'>
										Delete
									</button>
								</div>
							</li>
						))}
					</ul>
				</section>
			)}
		</>
	)
}
