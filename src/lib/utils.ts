import { Point } from './point'

export function pointsToPath(points: Point[], closedPath?: boolean): string {
	if (points.length == 0) return ''

	if (closedPath) {
		points = points.concat(points[0])
	}

	let d = ''

	d += `M${points[0].x},${points[0].y} `

	for (let i = 1; i < points.length; i++) {
		const prePoint = points[i - 1]
		const point = points[i]

		if (prePoint.enablePostControl || point.enablePreControl) {
			if (prePoint.enablePostControl) d += `C${prePoint.postControlPoint.x},${prePoint.postControlPoint.y} `
			else d += `C${prePoint.x},${prePoint.y} `

			if (point.enablePreControl) d += `${point.preControlPoint.x},${point.preControlPoint.y} `
			else d += `${point.x},${point.y} `

			d += `${point.x},${point.y} `
		} else {
			d += `L${points[i].x},${points[i].y} `
		}
	}

	return d
}

export function fixNumber(value: string | number, decimals = 2) {
	return +Number(value).toFixed(decimals)
}
