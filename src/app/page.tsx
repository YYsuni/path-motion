'use client'

import PointComponent from '@/components/point'
import Run from '@/contents/buttons/run'
import Buttons from '@/contents/buttons'
import Paper from '@/contents/paper'
import { Point } from '@/lib/point'
import { pointsToPath } from '@/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import Clear from '@/contents/buttons/clear'
import PointControls from '@/contents/point-controls'

const store = {
	points: [] as Point[]
}

export default function Home() {
	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)

		// const keypressHandler = (e: KeyboardEvent) => {
		// 	if (e.key === 'Delete') {
		// 	}
		// }
		// window.addEventListener('keypress', keypressHandler)

		// return () => {
		// 	window.removeEventListener('keypress', keypressHandler)
		// }
	}, [])

	const [points, setPoints] = useState<Point[]>([])
	store.points = points

	const clear = useCallback(() => setPoints([]), [])

	const activePoint = points.find(item => item.active)

	const d = pointsToPath(points)

	return (
		<div className='relative h-screen w-screen'>
			{init && (
				<svg
					onClick={e => {
						const point = new Point({ x: e.pageX, y: e.pageY, setPoints })
						setPoints(state => {
							state.forEach(item => (item.active = false))
							return [...state, point]
						})
					}}
					viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
					fill='none'
					className='h-full w-full'
					xmlns='http://www.w3.org/2000/svg'>
					<path d={d} stroke='hsl(0 0% 20%)' strokeWidth={3} strokeLinejoin='round' />

					{points.map((item, index) => (
						<PointComponent key={item.uid} point={item} index={index} />
					))}
				</svg>
			)}

			<Paper d={d} points={points} />

			<Buttons>
				<Clear clear={clear} />
				<Run pointsStore={store} />
			</Buttons>

			<PointControls activePoint={activePoint} />
		</div>
	)
}
