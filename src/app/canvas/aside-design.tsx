import HighlightPathD from '@/components/highlight-path-d'
import { store } from './main'
import { fixNumber } from '@/lib/utils'
import { writeText } from '@/lib/clipboard'
import Checkbox from '@/components/checkbox'
import PointModeSVG from '@/svgs/point-mode.svg'
import ControlModeSVG from '@/svgs/contral-mode.svg'
import { useState } from 'react'
import clsx from 'clsx'

let copyTimer: any = null

export default function AsideDesign() {
	const [copied, setCopied] = useState(false)

	return (
		<>
			<h3 className='mt-6 px-3 text-sm'>Path</h3>
			<div className='max-h-[360px] min-h-[120px] overflow-auto break-all rounded-lg bg-gray-100 p-3 text-xs font-normal text-secondary'>
				{store.theD ? <HighlightPathD d={store.theD} /> : 'Click to make path.'}
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

			<h3 className='mt-9 px-3 text-sm'>Shape</h3>
			<div className='mt-3 flex gap-1'>
				<div
					onClick={() => {
						store.points.forEach(item => {
							item.enablePreControl = true
							item.initPreControlPoint()
							item.enablePostControl = true
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
					<div className='group-active:border-success mx-auto h-3 w-3 rounded-full border-2 border-secondary/80' />
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
					<div className='group-active:border-success mx-auto h-3 w-3 border-2 border-secondary/80' />
					Sharp
				</div>
			</div>

			<h3 className='mt-9 px-3 text-sm'>Features</h3>
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
		</>
	)
}
