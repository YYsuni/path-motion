import { Dispatch, SetStateAction } from 'react'
import { uid } from 'uid'
import { findPerpendicularPoints, pointsToPath } from './utils'
import { getPointAtLength, getTotalLength } from 'svg-path-commander'
import { store } from '@/app/canvas/main'

function setPointsError() {
	throw 'NULL SETPOINTS'
}

export class Point {
	uid: string
	x: number
	y: number
	active: boolean = false

	preControlPoint = { x: 0, y: 0 }
	postControlPoint = { x: 0, y: 0 }
	enablePreControl = false
	enablePostControl = false
	enableControlWeld = false
	enableControlEqual = false

	constructor({ x, y }: { x: number; y: number }) {
		this.uid = uid()

		this.x = x
		this.y = y
	}

	activate() {
		store.setPoints(state => {
			state.forEach(item => (item.active = false))
			this.active = true
			return [...state]
		})
	}

	get index() {
		return store.points.findIndex(item => item.uid == this.uid)
	}

	get points() {
		return store.points
	}

	setPoints(points: Point[] | ((prevState: Point[]) => Point[])) {
		store.setPoints(points)
	}

	getPrePoint() {
		const index = this.index
		if (index > 0) return store.points[index - 1]
		else return store.points[store.points.length - 1]
	}
	getPostPoint() {
		const index = this.index
		if (index < store.points.length - 1) return store.points[index + 1]
		else return store.points[0]
	}
	initControlPoints() {
		const prePoint = this.getPrePoint()
		const postPoint = this.getPostPoint()
		const [point1, point2] = findPerpendicularPoints(this, prePoint, postPoint, 0.5)

		this.preControlPoint.x = point1.x
		this.preControlPoint.y = point1.y
		this.postControlPoint.x = point2.x
		this.postControlPoint.y = point2.y
	}
	initPreControlPoint() {
		const prePoint = this.getPrePoint()
		const postPoint = this.getPostPoint()
		const [point1, point2] = findPerpendicularPoints(this, prePoint, postPoint, 0.5)

		this.preControlPoint.x = point1.x
		this.preControlPoint.y = point1.y
		this.preControlPoint.x = point1.x
		this.preControlPoint.y = point1.y
	}
	initPostControlPoint() {
		const prePoint = this.getPrePoint()
		const postPoint = this.getPostPoint()
		const [point1, point2] = findPerpendicularPoints(this, prePoint, postPoint, 0.5)

		this.postControlPoint.x = point2.x
		this.postControlPoint.y = point2.y
	}
	getPreControlLength() {
		const xDiff = this.preControlPoint.x - this.x
		const yDiff = this.preControlPoint.y - this.y
		return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
	}
	getPostControlLength() {
		const xDiff = this.postControlPoint.x - this.x
		const yDiff = this.postControlPoint.y - this.y
		return Math.sqrt(xDiff * xDiff + yDiff * yDiff)
	}
	syncPreControlPoint() {
		const preControlLength = this.getPreControlLength()
		const postControlLength = this.getPostControlLength()
		if (!postControlLength) return

		const ratio = this.enableControlEqual ? 1 : preControlLength / postControlLength

		const xDiff = this.postControlPoint.x - this.x
		const yDiff = this.postControlPoint.y - this.y

		this.preControlPoint.x = -xDiff * ratio + this.x
		this.preControlPoint.y = -yDiff * ratio + this.y
	}
	syncPostControlPoint() {
		const preControlLength = this.getPreControlLength()
		const postControlLength = this.getPostControlLength()
		if (!preControlLength) return

		const ratio = this.enableControlEqual ? 1 : postControlLength / preControlLength

		const xDiff = this.preControlPoint.x - this.x
		const yDiff = this.preControlPoint.y - this.y

		this.postControlPoint.x = -xDiff * ratio + this.x
		this.postControlPoint.y = -yDiff * ratio + this.y
	}

	deleteSelf() {
		const index = this.index
		if (index > -1) {
			store.points.splice(index, 1)
			this.setPoints(s => [...s])
		}
	}

	getAngle() {
		if (this.points.length < 2) return 0

		const lastPath = pointsToPath([this.getPrePoint(), this])

		const pathLength = getTotalLength(lastPath)
		const prePoint = getPointAtLength(lastPath, pathLength - 1)

		return Math.atan2(this.y - prePoint.y, this.x - prePoint.x) * (180 / Math.PI) + 90
	}
}
