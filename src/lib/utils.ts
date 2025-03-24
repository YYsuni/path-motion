import { Point } from './point'
import Decimal from 'decimal.js'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function pointsToPath(points: Point[], closedPath?: boolean, origin = [0, 0]): string {
	if (points.length == 0) return ''

	if (origin[0] != 0 || origin != origin) {
		points = points.map(item => {
			const p = new Point({
				x: minus(item.x, origin[0]),
				y: minus(item.y, origin[1])
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

export function pathToPoints(d: string) {
	const letterArr: string[] = []
	for (let i = 0; i < d.length; i++) {
		if (/[a-zA-Z]/.test(d[i])) letterArr.push(d[i])
	}

	let isClosedPath = false
	if (/[zZ]/.test(letterArr[letterArr.length - 1])) {
		isClosedPath = true
		letterArr.pop()
	}

	const numberArr = d
		.split(/[A-Za-z]/)
		.filter(item => !!item)
		.map(item => item.split(/[\s,]/).filter(item => !!item))

	if (letterArr.length != numberArr.length) return

	const arr: string[][] = letterArr.map((item, i) => [item, ...numberArr[i]])

	const points = arr.map((item, index) => {
		let point: Point
		if (item[0] === 'M' || item[0] === 'L') {
			point = new Point({ x: +item[1] || 0, y: +item[2] || 0 })
		} else {
			point = new Point({ x: +item[5] || 0, y: +item[6] || 0 })
		}

		if (item[0] === 'C') {
			point.enablePreControl = true
			point.preControlPoint.x = +item[3] || 0
			point.preControlPoint.y = +item[4] || 0
		}
		if (index < arr.length - 1 && arr[index + 1][0] === 'C') {
			point.enablePostControl = true
			point.postControlPoint.x = +arr[index + 1][1] || 0
			point.postControlPoint.y = +arr[index + 1][2] || 0
		}

		return point
	})

	return [points, isClosedPath] as [Point[], boolean]
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

type SimplePoint = { x: number; y: number }
export function distance(p1: SimplePoint, p2: SimplePoint): number {
	return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}
export function findPerpendicularPoints(current: SimplePoint, prePoint: SimplePoint, postPoint: SimplePoint, coefficient: number): [SimplePoint, SimplePoint] {
	const distanceToPre = distance(current, prePoint)
	const distanceToPost = distance(current, postPoint)

	const maxL = 300
	const L1 = Math.min(maxL, distanceToPre * coefficient)
	const L2 = Math.min(maxL, distanceToPost * coefficient)

	const midPoint: SimplePoint = {
		x: (prePoint.x + postPoint.x) / 2,
		y: (prePoint.y + postPoint.y) / 2
	}

	const dx = midPoint.x - current.x
	const dy = midPoint.y - current.y

	const perpendicularVector1: SimplePoint = { x: -dy, y: dx }

	const length = Math.sqrt(perpendicularVector1.x ** 2 + perpendicularVector1.y ** 2)
	const normalizedVector: SimplePoint = {
		x: perpendicularVector1.x / length,
		y: perpendicularVector1.y / length
	}

	const vectorToPre: SimplePoint = {
		x: prePoint.x - current.x,
		y: prePoint.y - current.y
	}

	const angle1 = Math.acos(
		(vectorToPre.x * normalizedVector.x + vectorToPre.y * normalizedVector.y) /
			(Math.sqrt(vectorToPre.x ** 2 + vectorToPre.y ** 2) * Math.sqrt(normalizedVector.x ** 2 + normalizedVector.y ** 2))
	)

	const angle2 = Math.acos(
		(vectorToPre.x * -normalizedVector.x + vectorToPre.y * -normalizedVector.y) /
			(Math.sqrt(vectorToPre.x ** 2 + vectorToPre.y ** 2) * Math.sqrt(normalizedVector.x ** 2 + normalizedVector.y ** 2))
	)

	if (angle1 < angle2) {
		return [
			{
				x: current.x + normalizedVector.x * L1,
				y: current.y + normalizedVector.y * L1
			},
			{
				x: current.x - normalizedVector.x * L2,
				y: current.y - normalizedVector.y * L2
			}
		]
	} else {
		return [
			{
				x: current.x - normalizedVector.x * L1,
				y: current.y - normalizedVector.y * L1
			},
			{
				x: current.x + normalizedVector.x * L2,
				y: current.y + normalizedVector.y * L2
			}
		]
	}
}
