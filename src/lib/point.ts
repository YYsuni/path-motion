import { Dispatch, SetStateAction } from 'react'
import { uid } from 'uid'

export class Point {
	uid: string
	x: number
	y: number
	active: boolean = true
	setPoints: Dispatch<SetStateAction<Point[]>>

	preControlPoint = { x: 0, y: 0 }
	postControlPoint = { x: 0, y: 0 }
	enablePreControl = false
	enablePostControl = false

	constructor({ x, y, setPoints }: { x: number; y: number; setPoints: Dispatch<SetStateAction<Point[]>> }) {
		this.uid = uid()

		this.x = x
		this.y = y
		this.setPoints = setPoints
	}

	activate() {
		this.setPoints(state => {
			state.forEach(item => (item.active = false))
			this.active = true
			return [...state]
		})
	}
}
