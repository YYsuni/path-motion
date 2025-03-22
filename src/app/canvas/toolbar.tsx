import PlaySVG from '@/svgs/play.svg'
import GithubSVG from '@/svgs/github.svg'
import { useRef, useState } from 'react'
import { animate, AnimationPlaybackControls } from 'motion'
import { motion } from 'motion/react'
import { store } from './main'
import { getPointAtLength } from 'svg-path-commander'
import MinusSVG from '@/svgs/buttons/minus.svg'
import PlusSVG from '@/svgs/buttons/plus.svg'
import FileSVG from '@/svgs/file.svg'
import CursorSVG from '@/svgs/cursor.svg'
import FigureSVG from '@/svgs/figure.svg'
import TriSVG from '@/svgs/tri.svg'

let currentAnimation = null as AnimationPlaybackControls | null

export default function Toolbar() {
	const [speed, setSpeed] = useState(800)
	const ref = useRef<HTMLDivElement>(null)

	return (
		<>
			<div ref={ref} className='fixed hidden'>
				<TriSVG className='absolute -top-5 right-0 h-10' />
			</div>

			<motion.div
				initial={{ bottom: 10, opacity: 0 }}
				animate={{ bottom: 16, opacity: 1 }}
				className='absolute bottom-6 flex h-12 items-center gap-3 rounded-full bg-white px-3 shadow'>
				{/* <a className='p-1 text-black/30 hover:text-black/50' href='https://github.com/YYsuni/path-motion' target='_blank'>
					<GithubSVG className='h-6 w-6' />
				</a> */}

				<button
					className='-mr-1 rounded-full p-1 text-success hover:bg-gray-100'
					onClick={() => {
						if (store.mouseMode === 'select') store.setMouseMode('create')
						else store.setMouseMode('select')
					}}>
					{store.mouseMode === 'select' ? <CursorSVG className='h-5 w-5' /> : <FigureSVG className='h-5 w-5' />}
				</button>

				<div className='flex cursor-pointer items-center gap-1 rounded-full bg-black/5 py-1 pl-2 pr-3 text-sm'>
					<FileSVG className='h-5 w-5 text-black/40' />

					<span className='font-normal text-secondary'>Untitled</span>
				</div>

				<button
					className='rounded-full bg-black/10 p-2.5 text-secondary active:bg-black/20 active:text-primary'
					onClick={() => {
						if (!store.d) return

						currentAnimation?.stop()
						const pathElement = document.getElementById('path') as any as SVGPathElement
						if (!pathElement) return

						const pathLength = pathElement.getTotalLength()

						ref.current!.style.display = 'block'
						currentAnimation = animate(0, 100, {
							ease: 'linear',
							onUpdate: latest => {
								const currentLength = (latest / 100) * pathLength
								const { x: currentX, y: currentY } = pathElement.getPointAtLength(currentLength)
								ref.current!.style.left = currentX + 'px'
								ref.current!.style.top = currentY + 'px'

								const nextPoint = pathElement.getPointAtLength(currentLength + 1)
								const angle = Math.atan2(nextPoint.y - currentY, nextPoint.x - currentX) * (180 / Math.PI) + 90

								ref.current!.style.rotate = angle - 90 + 'deg'
							},
							duration: pathLength / +speed,
							onComplete() {
								ref.current!.style.display = 'none'
							}
						})
					}}>
					<PlaySVG className='h-3 w-3' />
				</button>

				<div className='relative flex items-center text-secondary'>
					<button onClick={() => setSpeed(s => Math.max(0, s - 100))} className='rounded bg-black/5 p-1 text-[24px] active:bg-gray-200'>
						<MinusSVG className='h-4 w-4' />
					</button>
					<span className='inline-block w-[40px] text-center text-sm'>{speed}</span>

					<button onClick={() => setSpeed(s => s + 100)} className='rounded bg-black/5 p-1 text-[24px] active:bg-gray-200'>
						<PlusSVG className='h-4 w-4' />
					</button>
				</div>
			</motion.div>
		</>
	)
}
