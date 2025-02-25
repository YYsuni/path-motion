import { Dispatch, SetStateAction } from 'react'
import { uid } from 'uid'
import { pointsToPath } from './utils'
import { getPointAtLength, getTotalLength } from 'svg-path-commander'

export class Point {
	uid: string
	x: number
	y: number
	active: boolean = false
	setPoints: Dispatch<SetStateAction<Point[]>>

	preControlPoint = { x: 0, y: 0 }
	postControlPoint = { x: 0, y: 0 }
	enablePreControl = false
	enablePostControl = false
	enableControlWeld = false
	enableControlEqual = false

	static ControlLength = 40

	pointsStore = {
		points: [] as Point[],
		closedPath: false
	}

	constructor({ x, y, setPoints, pointsStore }: { x: number; y: number; setPoints: Dispatch<SetStateAction<Point[]>>; pointsStore: any }) {
		this.uid = uid()

		this.x = x
		this.y = y
		this.setPoints = setPoints
		this.pointsStore = pointsStore
	}

	activate() {
		this.setPoints(state => {
			state.forEach(item => (item.active = false))
			this.active = true
			return [...state]
		})
	}

	getIndex() {
		return this.pointsStore.points.findIndex(item => item.uid == this.uid)
	}
	getPoints() {
		return this.pointsStore.points
	}

	getPrePoint() {
		const index = this.getIndex()
		if (index > 0) return this.pointsStore.points[index - 1]
	}
	getPostPoint() {
		const index = this.getIndex()
		if (index < this.pointsStore.points.length - 1) return this.pointsStore.points[index + 1]
	}
	initPreControlPoint() {
		const prePoint = this.getPrePoint()
		let xDiff = 0
		let yDiff = 0

		if (prePoint) {
			xDiff = prePoint.x - this.x
			yDiff = prePoint.y - this.y
		} else {
			xDiff = -Point.ControlLength
		}

		const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
		if (!distance) return

		const controlLength = Math.min(Point.ControlLength, distance - 10)
		const ratio = controlLength / distance

		this.preControlPoint.x = xDiff * ratio + this.x
		this.preControlPoint.y = yDiff * ratio + this.y
	}
	initPostControlPoint() {
		const postPoint = this.getPostPoint()
		let xDiff = 0
		let yDiff = 0

		if (postPoint) {
			xDiff = postPoint.x - this.x
			yDiff = postPoint.y - this.y
		} else {
			xDiff = Point.ControlLength
		}

		const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
		if (!distance) return

		const controlLength = Math.min(Point.ControlLength, distance - 10)
		const ratio = controlLength / distance

		this.postControlPoint.x = xDiff * ratio + this.x
		this.postControlPoint.y = yDiff * ratio + this.y
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
		const index = this.getIndex()
		if (index > -1) {
			this.pointsStore.points.splice(index, 1)
			this.setPoints(s => [...s])
		}
	}

	getAngle() {
		let lastPath = ''
		const points = this.getPoints()

		if (this.pointsStore.closedPath && this.getIndex() == 0) {
			lastPath = pointsToPath([points[points.length - 1], points[0]])
		} else {
			if (points.length < 2) return 0
			lastPath = pointsToPath(points.slice(-2))
		}

		const pathLength = getTotalLength(lastPath)
		const prePoint = getPointAtLength(lastPath, pathLength - 1)

		return Math.atan2(this.y - prePoint.y, this.x - prePoint.x) * (180 / Math.PI) + 90
	}
}
