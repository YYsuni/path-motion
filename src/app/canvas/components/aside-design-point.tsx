import { Point } from '@/lib/point'
import { fixNumber } from '@/lib/utils'
import { store } from '../main'
import clsx from 'clsx'
import LLSVG from '@/svgs/point-controls/l-l.svg'
import CLSVG from '@/svgs/point-controls/c-l.svg'
import LCSVG from '@/svgs/point-controls/l-c.svg'
import CCSVG from '@/svgs/point-controls/c-c.svg'
import CCWSVG from '@/svgs/point-controls/c-c-w.svg'
import CCWESVG from '@/svgs/point-controls/c-c-w-e.svg'
import DeleteSVG from '@/svgs/delete.svg'
import { memo } from 'react'

interface Props {
	activePoint: Point
}

function AsideDesignPoint({ activePoint }: Props) {
	return (
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
						activePoint.enablePreControl && activePoint.enablePostControl && activePoint.enableControlWeld && !activePoint.enableControlEqual && 'text-brand'
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
	)
}

export default memo(AsideDesignPoint)
