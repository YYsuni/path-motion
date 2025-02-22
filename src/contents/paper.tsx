import HighlightPathD from '@/components/highlight-path-d'
import { Point } from '@/lib/point'
import { motion } from 'motion/react'
// import JsonView from 'react18-json-view'
// import 'react18-json-view/src/style.css'

interface Props {
	d: string
	points: Point[]
	staticize: Function
}

export default function Paper({ points, d, staticize }: Props) {
	const active = points.length > 0

	if (active)
		return (
			<motion.div
				onMouseDown={e => {
					e.stopPropagation()
					staticize()
				}}
				initial={{ display: 'none', scale: 0.4 }}
				animate={{ display: 'block', scale: 1 }}
				className='fixed bottom-8 left-8 max-w-[400px] rounded-lg bg-white/80 p-6 text-sm shadow-md backdrop-blur'>
				<ul>
					<li>
						<div>
							Path <span className='rounded bg-gray-100 px-1 font-mono'>d</span> :
						</div>
						<div className='mt-1 rounded-md bg-gray-100 p-3 text-xs text-secondary'>
							<HighlightPathD d={d} />
						</div>
					</li>
				</ul>
			</motion.div>
		)
}
