import { Point } from '@/lib/point'
import { motion } from 'motion/react'

interface Props {
	activePoint?: Point
}

export default function PointControls({ activePoint }: Props) {
	if (activePoint)
		return (
			<motion.div animate={{ left: activePoint.x, top: activePoint.y }} className='fixed'>
				<div className='relative top-4 -translate-x-1/2 rounded-lg border border-gray-500 bg-white p-6'>Point Controls</div>
			</motion.div>
		)
}
