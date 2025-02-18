import { Point } from '@/lib/point'
import { pointsToPath } from '@/lib/utils'
import { animate, AnimationPlaybackControls } from 'motion'
import { memo, useRef } from 'react'
import { getPointAtLength, getTotalLength } from 'svg-path-commander'

interface Props {
	pointsStore: { points: Point[] }
}

const speed = 500

let currentAnimation = null as AnimationPlaybackControls | null

function Run({ pointsStore }: Props) {
	const ref = useRef<HTMLDivElement>(null)

	return (
		<section>
			<div
				ref={ref}
				className='absolute bottom-2 left-0 top-0 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black bg-white'></div>

			<button
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
						duration: pathLength / speed
					})
				}}
				className='fixed bottom-8 right-12 w-[120px] rounded-md border-[1.5px] border-black bg-white py-1'>
				Run
			</button>
		</section>
	)
}

export default memo(Run)
