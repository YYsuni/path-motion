import { Point } from './point'

export function pointsToPath(points: Point[]): string {
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
