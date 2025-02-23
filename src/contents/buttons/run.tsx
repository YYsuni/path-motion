import { Point } from '@/lib/point'
import { pointsToPath } from '@/lib/utils'
import { animate, AnimationPlaybackControls } from 'motion'
import { memo, useRef, useState } from 'react'
import { getPointAtLength, getTotalLength } from 'svg-path-commander'
import PlaySVG from '@/svgs/buttons/play.svg'
import MinusSVG from '@/svgs/buttons/minus.svg'
import PlusSVG from '@/svgs/buttons/plus.svg'

interface Props {
	pointsStore: { points: Point[]; d: string; totalLength: number }
}

let currentAnimation = null as AnimationPlaybackControls | null

function Run({ pointsStore }: Props) {
	const ref = useRef<HTMLDivElement>(null)

	const [speed, setSpeed] = useState('800')

	return (
		<>
			<div
				ref={ref}
				className='fixed bottom-2 left-0 top-0 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-white'></div>

			<div className='w-[120px] space-y-2'>
				<label>
					<span className='text-xs text-secondary'>Speed</span>
					<div className='relative flex items-center'>
						<button
							onClick={() => setSpeed(s => String(Math.max(0, +s - 100)))}
							className='absolute left-1 rounded border bg-white p-1 text-[24px] active:bg-gray-200'>
							<MinusSVG className='h-4 w-4' />
						</button>
						<button onClick={() => setSpeed(s => String(+s + 100))} className='absolute right-1 rounded border bg-white p-1 text-[24px] active:bg-gray-200'>
							<PlusSVG className='h-4 w-4' />
						</button>
						<input
							onInput={e => {
								const target = e.target as HTMLInputElement
								const value = target.value
								if (/^[0-9\.,]*$/.test(value)) setSpeed(value)
							}}
							className='text-smf block w-full rounded bg-gray-100 px-8 py-1 text-center font-mono focus:outline-none'
							value={speed}
						/>
					</div>
				</label>
				<button
					onClick={() => {
						currentAnimation?.stop()

						const d = pointsStore.d
						const pathLength = pointsStore.totalLength

						ref.current!.style.display = 'block'
						currentAnimation = animate(0, 100, {
							ease: 'linear',
							onUpdate: latest => {
								const currentLength = (latest / 100) * pathLength
								const { x: currentX, y: currentY } = getPointAtLength(d, currentLength)
								ref.current!.style.left = currentX + 'px'
								ref.current!.style.top = currentY + 'px'
							},
							duration: pathLength / +speed,
							onComplete() {
								ref.current!.style.display = 'none'
							}
						})
					}}
					className='flex w-full justify-center rounded-md bg-gray-800 py-1.5 text-white'>
					{/* <PlaySVG className='h-6 w-6' /> */}
					Play
				</button>
			</div>
		</>
	)
}

export default memo(Run)
