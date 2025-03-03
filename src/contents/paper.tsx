import HighlightPathD from '@/components/highlight-path-d'
import { Point } from '@/lib/point'
import { fixNumber } from '@/lib/utils'
import { motion } from 'motion/react'
import { Dispatch, SetStateAction, useReducer, useState } from 'react'
import { getTotalLength } from 'svg-path-commander'
import DocSVG from '@/svgs/doc.svg'
import { div } from 'motion/react-client'
// import JsonView from 'react18-json-view'
// import 'react18-json-view/src/style.css'

interface Props {
	d: string
	points: Point[]
	setPoints: Dispatch<SetStateAction<Point[]>>
	totalLength: number
	staticize: Function
}

export default function Paper({ points, d, staticize, totalLength, setPoints }: Props) {
	const active = points.length > 0
	const [open, triggerOpen] = useReducer(s => !s, true)

	if (active)
		return (
			<div
				className='fixed bottom-8 left-8'
				onMouseDown={e => {
					e.stopPropagation()
					staticize()
				}}>
				{open && (
					<motion.div
						initial={{ display: 'none', scale: 0.4 }}
						animate={{ display: 'block', scale: 1 }}
						className='pointer-events-auto w-[400px] origin-bottom-left rounded-lg bg-white/80 p-6 pb-10 text-sm shadow-md backdrop-blur'>
						<ul className='space-y-3'>
							<li>
								<div>
									Path <span className='rounded bg-gray-100 px-1 font-mono'>d</span> :
								</div>
								<div className='mt-1 rounded-md bg-gray-100 p-3 font-mono text-xs text-secondary'>
									<HighlightPathD d={d} />
								</div>
							</li>
							<li>
								<div>Path Length :</div>
								<div className='mt-1 rounded-md bg-gray-100 p-3 font-mono text-xs text-secondary'>{totalLength}</div>
							</li>

							<li className='flex items-center gap-1.5'>
								<button
									onClick={() => {
										points.forEach(item => {
											item.x = fixNumber(item.x)
											item.y = fixNumber(item.y)
											item.preControlPoint.x = fixNumber(item.preControlPoint.x)
											item.preControlPoint.y = fixNumber(item.preControlPoint.y)
											item.postControlPoint.x = fixNumber(item.postControlPoint.x)
											item.postControlPoint.y = fixNumber(item.postControlPoint.y)
										})
										setPoints([...points])
									}}
									className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
									Minify
								</button>
							</li>
						</ul>
					</motion.div>
				)}

				<button onClick={triggerOpen} className='absolute bottom-0 left-0 rounded-lg border bg-white p-1'>
					<DocSVG className='h-5 w-5 rounded-full' />
				</button>
			</div>
		)
}
