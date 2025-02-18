import { Point } from '@/lib/point'
import { motion } from 'motion/react'
import { useState } from 'react'

interface Props {
	point: Point
	index: number
}

export default function PointComponent({ point, index }: Props) {
	const [active, setActive] = useState(false)
	const theActive = active || point.active

	return (
		<motion.circle
			onMouseEnter={() => setActive(true)}
			onMouseOut={() => setActive(false)}
			onPan={e => {
				point.x = e.pageX
				point.y = e.pageY
				point.activate()
			}}
			onClick={e => {
				e.stopPropagation()
				point.activate()
			}}
			cx={point.x}
			cy={point.y}
			r={6}
			animate={{
				fill: theActive ? 'white' : 'transparent',
				stroke: theActive ? 'black' : 'transparent',
				scale: theActive ? 1 : 0.5
			}}
			transition={{}}
			strokeWidth={2}
			className='cursor-pointer'
		/>
	)
}
