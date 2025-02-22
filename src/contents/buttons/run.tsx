import { Point } from '@/lib/point'
import { pointsToPath } from '@/lib/utils'
import { animate, AnimationPlaybackControls } from 'motion'
import { memo, useRef } from 'react'
import { getPointAtLength, getTotalLength } from 'svg-path-commander'

interface Props {
	pointsStore: { points: Point[] }
	staticize: Function
}

const speed = 500

let currentAnimation = null as AnimationPlaybackControls | null

function Run({ pointsStore, staticize }: Props) {
	const ref = useRef<HTMLDivElement>(null)

	return (
		<>
			<div
				ref={ref}
				className='fixed bottom-2 left-0 top-0 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-white'></div>

			<button
				onMouseDown={e => {
					e.stopPropagation()
					staticize()
				}}
				onClick={() => {
					currentAnimation?.stop()

					const d = pointsToPath(pointsStore.points)
					const pathLength = getTotalLength(d)

					ref.current!.style.display = 'block'
					currentAnimation = animate(0, 100, {
						onUpdate: latest => {
							const currentLength = (latest / 100) * pathLength
							const { x: currentX, y: currentY } = getPointAtLength(d, currentLength)
							ref.current!.style.left = currentX + 'px'
							ref.current!.style.top = currentY + 'px'
						},
						duration: pathLength / speed,
						onComplete() {
							ref.current!.style.display = 'none'
						}
					})
				}}
				className='w-[120px] rounded-md border-[1.5px] bg-gray-800 py-1 text-white'>
				Run
			</button>
		</>
	)
}

export default memo(Run)
