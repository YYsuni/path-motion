import { Point } from './point'
import Decimal from 'decimal.js'

export function pointsToPath(points: Point[], closedPath?: boolean, origin = [0, 0]): string {
	if (points.length == 0) return ''

	if (origin[0] != 0 || origin != origin) {
		points = points.map(item => {
			const p = new Point({
				x: minus(item.x, origin[0]),
				y: minus(item.y, origin[1]),
				setPoints: () => {},
				pointsStore: {}
			})

			p.preControlPoint.x = minus(item.preControlPoint.x, origin[0])
			p.preControlPoint.y = minus(item.preControlPoint.y, origin[1])
			p.postControlPoint.x = minus(item.postControlPoint.x, origin[0])
			p.postControlPoint.y = minus(item.postControlPoint.y, origin[1])
			p.enablePostControl = item.enablePostControl
			p.enablePreControl = item.enablePreControl

			return p
		})
	}

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

function minus(a: number, b: number) {
	return new Decimal(a).minus(b).toNumber()
}

export function fixNumber(value: string | number, decimals = 2) {
	return +Number(value).toFixed(decimals)
}

export function isBetween(num: number, start: number, end: number) {
	return num >= start && num <= end
}
