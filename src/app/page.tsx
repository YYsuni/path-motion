'use client'

import PointComponent from '@/components/point'
import Run from '@/contents/buttons/run'
import Buttons from '@/contents/buttons'
import Paper from '@/contents/paper'
import { Point } from '@/lib/point'
import { isBetween, pointsToPath } from '@/lib/utils'
import { useCallback, useEffect, useReducer, useState } from 'react'
import Clear from '@/contents/buttons/clear'
import PointControls from '@/components/point-controls'
import ArrowHeadSVG from '@/svgs/arrowhead.svg'
import ClosePath from '@/contents/buttons/close-path'
import { getTotalLength } from 'svg-path-commander'
import { debounceSave, getLocalMeta, getLocalPoints, getStorage, setStorage } from '@/lib/storage'
import { CanvasMode, MouseMode } from '@/consts'

const store = {
	points: [] as Point[],
	closedPath: false,
	d: '',
	totalLength: 0,

	canvasMode: 'normal' as CanvasMode,

	mouseMode: 'create' as MouseMode,
	creatingPoint: null as Point | null,
	selectStart: null as { x: number; y: number } | null
}

export default function Home() {
	const [init, setInit] = useState(false)
	const [[screenWidth, screenHeight], setScreenSize] = useState([0, 0])
	const [mouseDown, setMouseDown] = useState(false)

	// Canvas canvasMode
	const [canvasMode, setCanvasMode] = useState<CanvasMode>('normal')
	const [mouseMode, setMouseMode] = useState<MouseMode>('create')
	store.canvasMode = canvasMode
	store.mouseMode = mouseMode

	// Points
	const [points, setPoints] = useState<Point[]>([])
	store.points = points
	const staticize = useCallback(() => {
		store.points.forEach(item => (item.active = false))
		setPoints([...store.points])
	}, [])
	const clear = useCallback(() => setPoints([]), [])

	const activePoint = points.find(item => item.active)

	const [closedPath, triggerClosedPath] = useReducer(s => !s, false)
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
		const localPoints = getLocalPoints(setPoints, store)
		if (localPoints) setPoints(localPoints)
		const localMeta = getLocalMeta()
		if (localMeta) triggerClosedPath()

		// Init modes from local storage
		const localCanvasMode = getStorage('canvasMode')
		const localMouseMode = getStorage('mouseMode')
		if (localCanvasMode) setCanvasMode(localCanvasMode as any)
		if (localMouseMode) setMouseMode(localMouseMode as any)

		// Screen resize
		const reszieHandle = () => {
			setScreenSize([window.innerWidth, window.innerHeight])
		}
		reszieHandle()
		window.addEventListener('resize', reszieHandle)

		// Events handling

		const mouseDownHandle = (e: MouseEvent) => {
			if (e.which !== 1) return

			setMouseDown(true)

			if (store.mouseMode === 'create' || store.points.length <= 0) {
				const point = new Point({ x: e.pageX, y: e.pageY, setPoints, pointsStore: store })
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

		window.addEventListener('mousedown', mouseDownHandle)
		window.addEventListener('mousedown', mouseDownHandleCapture, { capture: true })
		window.addEventListener('mouseup', mouseUpHandle)
		window.addEventListener('mousemove', mounceMoveHandle)

		return () => {
			window.removeEventListener('resize', reszieHandle)

			window.removeEventListener('mousedown', mouseDownHandle)
			window.removeEventListener('mousedown', mouseDownHandleCapture, { capture: true })
			window.removeEventListener('mouseup', mouseUpHandle)
			window.removeEventListener('mousemove', mounceMoveHandle)
		}
	}, [])
	useEffect(() => {
		debounceSave(points, closedPath)
	}, [points, closedPath])
	useEffect(() => {
		setStorage('canvasMode', canvasMode)
		setStorage('mouseMode', mouseMode)
	}, [canvasMode, mouseMode])

	return (
		<div
			className='relative h-screen w-screen overflow-hidden focus-visible:outline-none'
			tabIndex={1}
			onKeyDown={e => {
				if (e.key === 'Delete' || e.code === 'Backspace') {
					activePoint?.deleteSelf()

					if (betterSelectedRect) {
						const unselectedPoints = points.filter(
							item =>
								!(isBetween(item.x, betterSelectedRect[0].x, betterSelectedRect[1].x) && isBetween(item.y, betterSelectedRect[0].y, betterSelectedRect[1].y))
						)

						setPoints(unselectedPoints)
					}
				}
			}}>
			{init && (
				<>
					<div className='pointer-events-none fixed bottom-1 right-1 font-mono text-xs text-gray-400'>
						{screenWidth}x{screenHeight}
					</div>

					{points.length > 1 && (
						<ArrowHeadSVG
							className='fixed z-[-1] w-8 origin-top'
							style={{
								left: endPoint.x - 16,
								top: endPoint.y,
								rotate: endPoint.getAngle() + 'deg'
							}}
						/>
					)}

					<svg viewBox={`0 0 ${screenWidth} ${screenHeight}`} fill='none' className='relative h-full w-full select-none' xmlns='http://www.w3.org/2000/svg'>
						<path d={d} stroke='hsl(0 0% 20%)' strokeWidth={3} strokeLinejoin='round' />

						{points.map((item, index) => (
							<PointComponent key={item.uid} point={item} canvasMode={canvasMode} betterSelectedRect={betterSelectedRect} />
						))}
					</svg>

					{betterSelectedRect && mouseDown && (
						<div
							className='fixed border-[1.5px] border-gray-800 bg-gray-900/20'
							style={{
								left: betterSelectedRect[0].x,
								top: betterSelectedRect[0].y,
								width: betterSelectedRect[1].x - betterSelectedRect[0].x,
								height: betterSelectedRect[1].y - betterSelectedRect[0].y
							}}></div>
					)}
				</>
			)}

			<Paper
				d={d}
				points={points}
				setPoints={setPoints}
				staticize={staticize}
				totalLength={totalLength}
				canvasMode={canvasMode}
				setCanvasMode={setCanvasMode}
				mouseMode={mouseMode}
				setMouseMode={setMouseMode}
			/>

			<Buttons staticize={staticize}>
				<div className='flex flex-col gap-3'>
					<ClosePath closePath={triggerClosedPath} closedPath={closedPath} />
					<Clear clear={clear} />
				</div>
				<Run pointsStore={store} />
			</Buttons>

			<PointControls activePoint={activePoint} />
		</div>
	)
}
