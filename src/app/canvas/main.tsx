'use client'

import { CanvasMode, MouseMode } from '@/consts'
import { Point } from '@/lib/point'
import { isBetween, pointsToPath } from '@/lib/utils'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { getTotalLength } from 'svg-path-commander'
import Aside from './aside'
import { getLocalMeta, getLocalPoints, getStorage } from '@/lib/storage'
import { motion } from 'motion/react'
import PointComponent from '@/components/point'

export const store = {
	points: [] as Point[],
	setPoints: ((points: Point[]) => {}) as Dispatch<SetStateAction<Point[]>>,
	closedPath: false,
	d: '',
	totalLength: 0,

	canvasMode: 'normal' as CanvasMode,

	mouseMode: 'create' as MouseMode,
	creatingPoint: null as Point | null,
	selectStart: null as { x: number; y: number } | null
}

const ORIGIN_RADIUS = 10000
const ORIGIN_WIDTH = 1
const ORIGIN_COLOR = '#6666'
let originTimer: NodeJS.Timeout | undefined

export default function Main() {
	const [init, setInit] = useState(false)
	const mainRef = useRef<HTMLElement>(null)
	const [[mainWidth, mainHeight], setMainSize] = useState([0, 0])
	const [[canvasWidth, canvasHeight], setCanvasSize] = useState([0, 0])
	const [mouseDown, setMouseDown] = useState(false)

	// Canvas canvasMode
	const [canvasMode, setCanvasMode] = useState<CanvasMode>('normal')
	const [mouseMode, setMouseMode] = useState<MouseMode>('create')
	store.canvasMode = canvasMode
	store.mouseMode = mouseMode

	// Coordinate origin
	const [origin, setOrigin] = useState([0, 0])
	const [showOrigin, setShowOrigin] = useState(false)
	useEffect(() => {
		setShowOrigin(true)

		clearTimeout(originTimer)
		originTimer = setTimeout(() => setShowOrigin(false), 3000)
	}, [origin])

	// Points
	const [points, setPoints] = useState<Point[]>([])
	store.points = points
	store.setPoints = setPoints
	const staticize = useCallback(() => {
		store.points.forEach(item => (item.active = false))
		setPoints([...store.points])
	}, [])
	const clear = useCallback(() => {
		setPoints([])
		setMouseMode('create')
	}, [])
	const activePoint = points.find(item => item.active)

	const [closedPath, setClosedPath] = useState(false)
	store.closedPath = closedPath
	const endPoint = points.length > 2 && closedPath ? points[0] : points[points.length - 1]

	// Path d
	const d = pointsToPath(points, closedPath)
	const totalLength = getTotalLength(d)
	store.d = d
	store.totalLength = totalLength

	// Select
	const [selectedRect, setSelectedRect] = useState<{ x: number; y: number }[] | null>(null)
	const betterSelectedRect = selectedRect
		? [
				{ x: Math.min(selectedRect[0].x, selectedRect[1].x), y: Math.min(selectedRect[0].y, selectedRect[1].y) },
				{ x: Math.max(selectedRect[0].x, selectedRect[1].x), y: Math.max(selectedRect[0].y, selectedRect[1].y) }
			]
		: null

	useEffect(() => {
		setInit(true)

		// Init points from local storage
		const localPoints = getLocalPoints()
		if (localPoints) setPoints(localPoints)
		const localMeta = getLocalMeta()
		if (localMeta) setClosedPath(true)

		// Init modes from local storage
		const localCanvasMode = getStorage('canvasMode')
		const localMouseMode = getStorage('mouseMode')
		if (localCanvasMode) setCanvasMode(localCanvasMode as any)
		if (localMouseMode) setMouseMode(localMouseMode as any)

		// Init canvas sizes from local storage
		const cw = getStorage('canvas-width')!
		const ch = getStorage('canvas-height')!
		if (+cw || +ch) setCanvasSize([+cw || 0, +ch || 0])

		// Screen resize
		const reszieHandle = () => {
			if (mainRef.current) {
				const { width, height } = mainRef.current.getBoundingClientRect()
				setMainSize([width, height])
			}
		}
		reszieHandle()
		window.addEventListener('resize', reszieHandle)

		// Events handling

		const mouseDownHandle = (e: MouseEvent) => {
			if (e.which !== 1) return

			setMouseDown(true)

			if (store.mouseMode === 'create' || store.points.length <= 0) {
				const point = new Point({ x: e.pageX, y: e.pageY })
				setPoints(state => {
					state.forEach(item => (item.active = false))
					return [...state, point]
				})

				store.creatingPoint = point
			} else {
				store.selectStart = {
					x: e.pageX,
					y: e.pageY
				}
			}
		}
		const mouseDownHandleCapture = (e: MouseEvent) => {
			setSelectedRect(null)
		}

		const mouseUpHandle = () => {
			store.creatingPoint = null
			store.selectStart = null
			setMouseDown(false)
		}

		const MIN_OFFSET = 5
		const mounceMoveHandle = (e: MouseEvent) => {
			const creatingPoint = store.creatingPoint
			const seletStart = store.selectStart
			if (creatingPoint) {
				if (Math.abs(e.x - creatingPoint.x) < MIN_OFFSET && Math.abs(e.y - creatingPoint.y) < MIN_OFFSET) return

				if (!creatingPoint.enableControlEqual) {
					creatingPoint.enablePreControl = true
					creatingPoint.enablePostControl = true
					creatingPoint.enableControlWeld = true
					creatingPoint.enableControlEqual = true
					creatingPoint.initPreControlPoint()
				}

				creatingPoint.postControlPoint.x = e.x
				creatingPoint.postControlPoint.y = e.y
				creatingPoint.syncPreControlPoint()
				creatingPoint.activate()
			} else if (seletStart) {
				const endPosition = { x: e.x, y: e.y }

				if (Math.abs(endPosition.x - seletStart.x) < 5 || Math.abs(endPosition.y - seletStart.y) < 5) return

				setSelectedRect([seletStart, endPosition])
			}
		}

		mainRef.current!.addEventListener('mousedown', mouseDownHandle)
		window.addEventListener('mousedown', mouseDownHandleCapture, { capture: true })
		window.addEventListener('mouseup', mouseUpHandle)
		window.addEventListener('mousemove', mounceMoveHandle)

		return () => {
			window.removeEventListener('resize', reszieHandle)

			mainRef.current!.removeEventListener('mousedown', mouseDownHandle)
			window.removeEventListener('mousedown', mouseDownHandleCapture, { capture: true })
			window.removeEventListener('mouseup', mouseUpHandle)
			window.removeEventListener('mousemove', mounceMoveHandle)
		}
	}, [])

	// Actions
	const deleteHandle = useCallback((e: KeyboardEvent) => {
		if (e.key === 'Delete' || e.code === 'Backspace') {
			activePoint?.deleteSelf()
			store.points.forEach(point => {
				if (point.active) {
					point.deleteSelf()
				}
			})

			if (betterSelectedRect) {
				const unselectedPoints = store.points.filter(
					item => !(isBetween(item.x, betterSelectedRect[0].x, betterSelectedRect[1].x) && isBetween(item.y, betterSelectedRect[0].y, betterSelectedRect[1].y))
				)
				setPoints(unselectedPoints)
			}
		}
	}, [])

	return (
		<div className='flex h-screen w-screen overflow-hidden'>
			<main ref={mainRef} className='pattern-bg flex-1 overflow-hidden bg-[#F5F5F5]' tabIndex={1} onKeyDown={deleteHandle as any}>
				<svg viewBox={`0 0 ${mainWidth} ${mainHeight}`} fill='none' className='relative h-full w-full select-none' xmlns='http://www.w3.org/2000/svg'>
					{showOrigin && (
						<>
							<motion.rect
								animate={{
									x: origin[0] - ORIGIN_RADIUS - ORIGIN_WIDTH / 2,
									y: origin[1] - ORIGIN_WIDTH / 2
								}}
								transition={{ ease: 'linear' }}
								width={ORIGIN_RADIUS * 2 + ORIGIN_WIDTH}
								height={ORIGIN_WIDTH}
								fill={ORIGIN_COLOR}
							/>
							<motion.rect
								animate={{ x: origin[0] - ORIGIN_WIDTH / 2, y: origin[1] - ORIGIN_RADIUS - ORIGIN_WIDTH / 2 }}
								transition={{ ease: 'linear' }}
								width={ORIGIN_WIDTH}
								height={ORIGIN_RADIUS * 2 + ORIGIN_WIDTH}
								fill={ORIGIN_COLOR}
							/>
						</>
					)}

					<text x={origin[0] + 5} y={origin[1] - 5} className='text-black/40' fill='currentColor' fontSize={10}>
						(0, 0)
					</text>

					<path d={d} stroke='hsl(0 0% 20%)' strokeWidth={3} strokeLinejoin='round' />

					{points.map(item => (
						<PointComponent key={item.uid} point={item} canvasMode={canvasMode} betterSelectedRect={betterSelectedRect} />
					))}
				</svg>
			</main>
			<aside className='w-[300px] bg-[#F9F9F9] shadow-xl shadow-gray-200'>
				<Aside />
			</aside>
		</div>
	)
}
