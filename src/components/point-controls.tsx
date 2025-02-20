import { Point } from '@/lib/point'
import { motion } from 'motion/react'
import LLSVG from '@/svgs/point-controls/l-l.svg'
import CLSVG from '@/svgs/point-controls/c-l.svg'
import LCSVG from '@/svgs/point-controls/l-c.svg'
import CCSVG from '@/svgs/point-controls/c-c.svg'
import CCESVG from '@/svgs/point-controls/c-c-e.svg'
import { useEffect, useState } from 'react'
import { addEventListener } from '@/lib/window-event'
import clsx from 'clsx'

interface Props {
	activePoint?: Point
}

export default function PointControls({ activePoint }: Props) {
	const [active, setActive] = useState(true)

	const theActive = activePoint && active

	useEffect(() => {
		return addEventListener('activate-point-controls', () => setActive(true))
	}, [])

	if (activePoint)
		return (
			<motion.div animate={{ left: activePoint.x, top: activePoint.y }} className={clsx('fixed', !theActive && 'pointer-events-none opacity-0')}>
				<div className='relative top-4 flex -translate-x-1/2 items-center gap-1 rounded-lg bg-white p-2 shadow-md'>
					<button
						onClick={() => {
							activePoint.enablePreControl = false
							activePoint.enablePostControl = false
							activePoint.enableControlEqual = false
							activePoint.activate()
						}}
						className='rounded p-1 hover:bg-gray-200 active:bg-gray-300 active:shadow-inner'>
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
						className='rounded p-1 hover:bg-gray-200 active:bg-gray-300 active:shadow-inner'>
						<CLSVG className='h-5 w-5' />
					</button>
					<button
						onClick={() => {
							activePoint.enablePreControl = false
							if (!activePoint.enablePostControl) {
								activePoint.enablePostControl = true
								activePoint.initPostControlPoint()
							}
							activePoint.enableControlEqual = false
							activePoint.activate()
						}}
						className='rounded p-1 hover:bg-gray-200 active:bg-gray-300 active:shadow-inner'>
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
							activePoint.enableControlEqual = false
							activePoint.activate()
						}}
						className='rounded p-1 hover:bg-gray-200 active:bg-gray-300 active:shadow-inner'>
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
							activePoint.enableControlEqual = true
							activePoint.syncPostControlPoint()
							activePoint.activate()
						}}
						className='rounded p-1 hover:bg-gray-200 active:bg-gray-300 active:shadow-inner'>
						<CCESVG className='h-5 w-5' />
					</button>

					<div className='h-5 border-l'></div>

					<button
						onClick={() => {
							setActive(false)
						}}
						className='h-7 w-7 rounded hover:bg-gray-200 active:bg-gray-300 active:shadow-inner'>
						x
					</button>
				</div>
			</motion.div>
		)
}
