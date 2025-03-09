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

	get index() {
		return this.pointsStore.points.findIndex(item => item.uid == this.uid)
	}

	get points() {
		return this.pointsStore.points
	}

	getPrePoint() {
		const index = this.index
		if (index > 0) return this.pointsStore.points[index - 1]
		else return this.pointsStore.points[this.pointsStore.points.length - 1]
	}
	getPostPoint() {
		const index = this.index
		if (index < this.pointsStore.points.length - 1) return this.pointsStore.points[index + 1]
		else return this.pointsStore.points[0]
	}
	initPreControlPoint() {
		const prePoint = this.getPrePoint()
		const postPoint = this.getPostPoint()
		let xDiff = 0
		let yDiff = 0

		if (this.points.length >= 3) {
			const postPoint = this.getPostPoint()
			xDiff = prePoint.x - postPoint.x
			yDiff = prePoint.y - postPoint.y
		} else if (prePoint) {
			xDiff = prePoint.x - this.x
			yDiff = prePoint.y - this.y
		}

		const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)

		if (!distance) return

		const preLength = Math.sqrt((this.x - prePoint.x) ** 2 + (this.y - prePoint.y) ** 2)
		const postLength = Math.sqrt((this.x - postPoint.x) ** 2 + (this.y - postPoint.y) ** 2)
		const controlLength = Math.min(preLength / 3, postLength / 3)
		const ratio = controlLength / distance

		this.preControlPoint.x = xDiff * ratio + this.x
		this.preControlPoint.y = yDiff * ratio + this.y
	}
	initPostControlPoint() {
		const postPoint = this.getPostPoint()
		const prePoint = this.getPrePoint()
		let xDiff = 0
		let yDiff = 0

		if (this.points.length >= 3) {
			xDiff = postPoint.x - postPoint.x
			yDiff = postPoint.y - postPoint.y
		} else if (postPoint) {
			xDiff = postPoint.x - this.x
			yDiff = postPoint.y - this.y
		}

		const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
		if (!distance) return

		const preLength = Math.sqrt((this.x - prePoint.x) ** 2 + (this.y - prePoint.y) ** 2)
		const postLength = Math.sqrt((this.x - postPoint.x) ** 2 + (this.y - postPoint.y) ** 2)
		const controlLength = Math.min(preLength / 3, postLength / 3)
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
		const index = this.index
		if (index > -1) {
			this.pointsStore.points.splice(index, 1)
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
