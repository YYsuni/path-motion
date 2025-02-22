'use client'

import PointComponent from '@/components/point'
import Run from '@/contents/buttons/run'
import Buttons from '@/contents/buttons'
import Paper from '@/contents/paper'
import { Point } from '@/lib/point'
import { pointsToPath } from '@/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import Clear from '@/contents/buttons/clear'
import PointControls from '@/components/point-controls'

const store = {
	points: [] as Point[],
	creatingPoint: null as Point | null
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

	useEffect(() => {
		const mouceDownHandle = (e: MouseEvent) => {
			const point = new Point({ x: e.pageX, y: e.pageY, setPoints, pointsStore: store })
			setPoints(state => {
				state.forEach(item => (item.active = false))
				return [...state, point]
			})

			store.creatingPoint = point
		}

		const mouceUpHandle = () => {
			store.creatingPoint = null
		}

		const mounceMoveHandle = (e: MouseEvent) => {
			const creatingPoint = store.creatingPoint
			if (creatingPoint) {
				creatingPoint.enablePreControl = true
				creatingPoint.enablePostControl = true
				creatingPoint.enableControlWeld = true
				creatingPoint.enableControlEqual = true
				creatingPoint.postControlPoint.x = e.x
				creatingPoint.postControlPoint.y = e.y
				creatingPoint.initPreControlPoint()
				creatingPoint.syncPreControlPoint()
				creatingPoint.activate()
			}
		}

		window.addEventListener('mousedown', mouceDownHandle)
		window.addEventListener('mouseup', mouceUpHandle)
		window.addEventListener('mousemove', mounceMoveHandle)

		return () => {
			window.removeEventListener('mousedown', mouceDownHandle)
			window.removeEventListener('mouseup', mouceUpHandle)
			window.removeEventListener('mousemove', mounceMoveHandle)
		}
	}, [])

	return (
		<div className='relative h-screen w-screen'>
			{init && (
				<svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`} fill='none' className='h-full w-full' xmlns='http://www.w3.org/2000/svg'>
					<path d={d} stroke='hsl(0 0% 20%)' strokeWidth={3} strokeLinejoin='round' />

					{points.map((item, index) => (
						<PointComponent key={item.uid} point={item} />
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
