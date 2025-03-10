import { Point } from './point'
import { debounce } from 'ts-debounce'

const POINTS_LOCAL_KEY = 'points'
const META_LOCAL_KEY = 'closedPath'

export function savePoints(points: Point[]) {
	const str = pointsToJSON(points)
	localStorage.setItem(POINTS_LOCAL_KEY, str)
}

export function pointsToJSON(points: Point[]) {
	const pointsJSON = JSON.stringify(
		points.map(item => [
			item.x,
			item.y,
			item.preControlPoint.x,
			item.preControlPoint.y,
			item.postControlPoint.x,
			item.postControlPoint.y,
			item.enablePreControl,
			item.enablePostControl,
			item.enableControlWeld,
			item.enableControlEqual
		])
	)

	return pointsJSON
}

export function getLocalPoints(setPoints: any, pointsStore: any): Point[] | null {
	const str = localStorage.getItem(POINTS_LOCAL_KEY)
	if (!str) return null

	let pointsArr: any[] | null = null
	try {
		const value = JSON.parse(str)
		if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0]) && value[0].length === 10) {
			pointsArr = value
		}
	} catch (e) {
		console.warn('[JSON parse]', e)
	}

	if (Array.isArray(pointsArr)) {
		const points = pointsArr.map(item => new Point({ x: item[0], y: item[1], setPoints, pointsStore }))
		points.forEach((item, i) => {
			item.preControlPoint.x = pointsArr[i][2]
			item.preControlPoint.y = pointsArr[i][3]
			item.postControlPoint.x = pointsArr[i][4]
			item.postControlPoint.y = pointsArr[i][5]
			item.enablePreControl = pointsArr[i][6]
			item.enablePostControl = pointsArr[i][7]
			item.enableControlWeld = pointsArr[i][8]
			item.enableControlEqual = pointsArr[i][9]
		})

		return points
	}

	return null
}

export function saveMeta(closedPath: boolean) {
	localStorage.setItem(META_LOCAL_KEY, String(closedPath))
}
export function getLocalMeta() {
	return localStorage.getItem(META_LOCAL_KEY) === 'true'
}

export function savePointsAndMeta(points: Point[], closedPath: boolean) {
	savePoints(points)
	saveMeta(closedPath)
}

export const debounceSave = debounce(savePointsAndMeta, 1000)

type Key = 'canvasMode' | 'mouseMode' | 'canvas-width' | 'canvas-height'

export const setStorage = (key: Key, value: string) => {
	window.localStorage.setItem(key, value)
}

export const getStorage = (key: Key) => {
	if (typeof window !== 'undefined') return window.localStorage.getItem(key)
}

export const removeStorage = (key: Key) => {
	if (typeof window !== 'undefined') return window.localStorage.removeItem(key)
}
