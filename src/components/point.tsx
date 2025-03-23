import { CanvasMode } from '@/consts'
import { Point } from '@/lib/point'
import { isBetween } from '@/lib/utils'
import { dispatchEvent } from '@/lib/window-event'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'

const store = {
	preControlStartOffetX: 0,
	preControlStartOffetY: 0,
	postControlStartOffetX: 0,
	postControlStartOffetY: 0
}

interface Props {
	point: Point
	canvasMode: CanvasMode
	betterSelectedRect: { x: number; y: number }[] | null
}

export default function PointComponent({ point, canvasMode, betterSelectedRect }: Props) {
	const [active, setActive] = useState(false)
	const theActive = active || point.active
	const seleted =
		betterSelectedRect &&
		isBetween(point.x, betterSelectedRect[0].x, betterSelectedRect[1].x) &&
		isBetween(point.y, betterSelectedRect[0].y, betterSelectedRect[1].y)

	const animateStyle = useMemo(() => {
		if (seleted) {
			return {
				fill: '#fff',
				stroke: '#006aeb',
				scale: 1
			}
		}

		switch (`${theActive}, ${canvasMode}`) {
			case 'true, normal':
			case 'true, point':
			case 'false, refine':
				return {
					fill: '#fff',
					stroke: '#006aeb',
					scale: 1
				}
			case 'true, refine':
				return {
					fill: '#fff',
					stroke: '#006aeb',
					scale: 1
				}

			case 'false, point':
				return {
					fill: '#006aeb',
					stroke: '#fff0',
					scale: 0.8
				}

			case 'false, normal':
			default:
				return {
					fill: '#fff0',
					stroke: '#fff0',
					scale: 0.8
				}
		}
	}, [canvasMode, theActive, seleted])

	return (
		<>
			{(canvasMode === 'refine' || point.active) && point.enablePreControl && (
				<>
					<path d={`M${point.preControlPoint.x} ${point.preControlPoint.y} L${point.x} ${point.y}`} stroke='#999' strokeWidth={1.5} />
					<motion.circle
						onPan={e => {
							e.stopPropagation()
							point.preControlPoint.x = e.pageX
							point.preControlPoint.y = e.pageY
							if (point.enablePostControl && point.enableControlWeld) {
								point.syncPostControlPoint()
							}
							point.activate()
						}}
						onClick={e => {
							e.stopPropagation()
						}}
						className='cursor-pointer'
						strokeWidth={1.5}
						fill='#fff'
						stroke='#444'
						r={4}
						cx={point.preControlPoint.x}
						cy={point.preControlPoint.y}
					/>
				</>
			)}
			{(canvasMode === 'refine' || point.active) && point.enablePostControl && (
				<>
					<path d={`M${point.postControlPoint.x} ${point.postControlPoint.y} L${point.x} ${point.y}`} stroke='#999' strokeWidth={1.5} />
					<motion.circle
						onPan={e => {
							point.postControlPoint.x = e.pageX
							point.postControlPoint.y = e.pageY
							if (point.enablePreControl && point.enableControlWeld) {
								point.syncPreControlPoint()
							}

							point.activate()
						}}
						onClick={e => {
							e.stopPropagation()
						}}
						className='cursor-pointer'
						strokeWidth={1.5}
						fill='#fff'
						stroke='#444'
						r={4}
						cx={point.postControlPoint.x}
						cy={point.postControlPoint.y}
					/>
				</>
			)}

			<motion.circle
				onMouseDown={e => {
					store.preControlStartOffetX = point.preControlPoint.x - point.x
					store.preControlStartOffetY = point.preControlPoint.y - point.y
					store.postControlStartOffetX = point.postControlPoint.x - point.x
					store.postControlStartOffetY = point.postControlPoint.y - point.y
				}}
				onMouseEnter={() => setActive(true)}
				onMouseOut={() => setActive(false)}
				onPan={e => {
					point.x = e.pageX
					point.y = e.pageY
					point.preControlPoint.x = store.preControlStartOffetX + point.x
					point.preControlPoint.y = store.preControlStartOffetY + point.y
					point.postControlPoint.x = store.postControlStartOffetX + point.x
					point.postControlPoint.y = store.postControlStartOffetY + point.y
					point.activate()
				}}
				onClick={e => {
					point.activate()
					dispatchEvent('activate-point-controls')
				}}
				cx={point.x}
				cy={point.y}
				r={6}
				animate={animateStyle}
				strokeWidth={2}
				className='cursor-pointer'
			/>
		</>
	)
}
