import { Point } from '@/lib/point'
import { dispatchEvent } from '@/lib/window-event'
import { motion } from 'motion/react'
import { useState } from 'react'

interface Props {
	point: Point
}

const store = {
	preControlStartOffetX: 0,
	preControlStartOffetY: 0,
	postControlStartOffetX: 0,
	postControlStartOffetY: 0
}

export default function PointComponent({ point }: Props) {
	const [active, setActive] = useState(false)
	const theActive = active || point.active

	return (
		<>
			{point.active && point.enablePreControl && (
				<>
					<path d={`M${point.preControlPoint.x} ${point.preControlPoint.y} L${point.x} ${point.y}`} stroke='#6666' strokeWidth={2} />
					<motion.circle
						onMouseDown={e => e.stopPropagation()}
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
						strokeWidth={2}
						fill='white'
						stroke='black'
						r={5}
						cx={point.preControlPoint.x}
						cy={point.preControlPoint.y}
					/>
				</>
			)}
			{point.active && point.enablePostControl && (
				<>
					<path d={`M${point.postControlPoint.x} ${point.postControlPoint.y} L${point.x} ${point.y}`} stroke='#6666' strokeWidth={2} />
					<motion.circle
						onMouseDown={e => e.stopPropagation()}
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
						strokeWidth={2}
						fill='white'
						stroke='black'
						r={5}
						cx={point.postControlPoint.x}
						cy={point.postControlPoint.y}
					/>
				</>
			)}

			<motion.circle
				onMouseDown={e => {
					e.stopPropagation()
					store.preControlStartOffetX = point.preControlPoint.x - point.x
					store.preControlStartOffetY = point.preControlPoint.y - point.y
					store.postControlStartOffetX = point.postControlPoint.x - point.x
					store.postControlStartOffetY = point.postControlPoint.y - point.y

					console.log('store', store)
				}}
				onMouseEnter={() => setActive(true)}
				onMouseOut={() => setActive(false)}
				onPan={e => {
					e.stopPropagation()
					point.x = e.pageX
					point.y = e.pageY
					point.preControlPoint.x = store.preControlStartOffetX + point.x
					point.preControlPoint.y = store.preControlStartOffetY + point.y
					point.postControlPoint.x = store.postControlStartOffetX + point.x
					point.postControlPoint.y = store.postControlStartOffetY + point.y
					point.activate()
				}}
				onClick={e => {
					e.stopPropagation()
					point.activate()
					dispatchEvent('activate-point-controls')
				}}
				cx={point.x}
				cy={point.y}
				r={6}
				animate={{
					fill: theActive ? 'white' : 'transparent',
					stroke: theActive ? 'black' : 'transparent',
					scale: theActive ? 1 : 0.8
				}}
				strokeWidth={2}
				className='cursor-pointer'
			/>
		</>
	)
}
