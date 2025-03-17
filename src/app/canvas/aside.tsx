import { useState } from 'react'
import CursorSVG from '@/svgs/cursor.svg'
import SettingSVG from '@/svgs/setting.svg'
import clsx from 'clsx'
import HighlightPathD from '@/components/highlight-path-d'
import { store } from './main'
import { fixNumber } from '@/lib/utils'
import { writeText } from '@/lib/clipboard'

let copyTimer: any = null

export default function Aside() {
	const [tab, setTab] = useState(0)
	const [copied, setCopied] = useState(false)

	return (
		<div className='p-6'>
			<ul className='grid grid-cols-2 gap-1 rounded-lg bg-black/5 p-1 text-xs text-secondary'>
				<li onClick={() => setTab(0)} className={clsx('flex cursor-pointer items-center justify-center rounded-md p-1', tab == 0 && 'bg-white text-primary')}>
					<CursorSVG className='mr-1 h-4 w-4' />
					<span>Design</span>
				</li>
				<li onClick={() => setTab(1)} className={clsx('flex cursor-pointer items-center justify-center rounded-md p-1', tab == 1 && 'bg-white text-primary')}>
					<SettingSVG className='mr-1 h-4 w-4' />
					<span>Setting</span>
				</li>
			</ul>

			<h3 className='mt-3 px-3 text-sm'>Path</h3>
			<div className='rounded-lg bg-gray-100 p-3 text-xs font-normal text-secondary'>
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
			</div>
		</div>
	)
}
