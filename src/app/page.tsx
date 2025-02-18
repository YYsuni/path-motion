'use client'

import PointComponent from '@/components/point'
import Run from '@/components/run'
import { Point } from '@/lib/point'
import { pointsToPath } from '@/lib/utils'
import { useEffect, useState } from 'react'

const store = {
	points: [] as Point[]
}

export default function Home() {
	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)

		const keypressHandler = (e: KeyboardEvent) => {
			if (e.key === 'Delete' || e.keyCode === 46) {
				alert('Del')
			}
		}
		document.addEventListener('keypress', keypressHandler)

		return () => {
			document.removeEventListener('keypress', keypressHandler)
		}
	}, [])

	const [points, setPoints] = useState<Point[]>([])
	store.points = points

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
					<path d={pointsToPath(points)} stroke='hsl(0 0% 20%)' strokeWidth={3} strokeLinejoin='round' />

					{points.map((item, index) => (
						<PointComponent key={item.uid} point={item} index={index} />
					))}
				</svg>
			)}

			<Run pointsStore={store} />
		</div>
	)
}
