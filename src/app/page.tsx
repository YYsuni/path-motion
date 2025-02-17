'use client'

import { useEffect, useState } from 'react'

class Point {
	x: number
	y: number

	constructor({ x, y }: { x: number; y: number }) {
		this.x = x
		this.y = y
	}
}

function pointsToPath(points: Point[]): string {
	if (points.length == 0) return ''

	const copyOfPoints = points.slice()

	let d = ''

	const firstPoint = copyOfPoints.shift()!

	d += `M ${firstPoint.x} ${firstPoint.y}`

	for (let point of copyOfPoints) {
		d += `L ${point.x} ${point.y}`
	}

	return d
}

export default function Home() {
	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)
	}, [])

	const [points, setPoints] = useState<Point[]>([])

	return (
		<div
			className='relative h-screen w-screen'
			onClick={e => {
				const point = new Point({ x: e.pageX, y: e.pageY })
				setPoints(state => [...state, point])
			}}>
			{init && (
				<svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`} fill='none' className='h-full w-full' xmlns='http://www.w3.org/2000/svg'>
					<path d={pointsToPath(points)} stroke='hsl(0 0% 20%)' strokeWidth={2} />
				</svg>
			)}
		</div>
	)
}
