'use client'

import PointComponent from '@/components/point'
import Run from '@/contents/buttons/run'
import Buttons from '@/contents/buttons'
import Paper from '@/contents/paper'
import { Point } from '@/lib/point'
import { pointsToPath } from '@/lib/utils'
import { useCallback, useEffect, useReducer, useState } from 'react'
import Clear from '@/contents/buttons/clear'
import PointControls from '@/components/point-controls'
import ArrowHeadSVG from '@/svgs/arrowhead.svg'
import ClosePath from '@/contents/buttons/close-path'
import { getTotalLength } from 'svg-path-commander'
import { debounceSave, getLocalMeta, getLocalPoints } from '@/lib/storage'
import { CanvasMode } from '@/consts'

const store = {
	points: [] as Point[],
	creatingPoint: null as Point | null,
	closedPath: false,
	d: '',
	totalLength: 0,
	mode: 'normal' as CanvasMode
}

export default function Home() {
	const [init, setInit] = useState(false)
	const [[screenWidth, screenHeight], setScreenSize] = useState([0, 0])

	// Canvas mode
	const [mode, setMode] = useState<CanvasMode>('normal')
	store.mode = mode

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

	const d = pointsToPath(points, closedPath)
	const totalLength = getTotalLength(d)
	store.d = d
	store.totalLength = totalLength

	useEffect(() => {
		setInit(true)

		// Screen resize
		const reszieHandle = () => {
			setScreenSize([window.innerWidth, window.innerHeight])
		}
		window.addEventListener('resize', reszieHandle)

		// Keyboard events
		const keypressHandle = (e: KeyboardEvent) => {
			console.log('e', e)
			if (e.key === 'Delete') {
			}
		}
		window.addEventListener('keypress', keypressHandle, { capture: true })

		// Init points from local storage
		const localPoints = getLocalPoints(setPoints, store)
		if (localPoints) setPoints(localPoints)
		const localMeta = getLocalMeta()
		if (localMeta) triggerClosedPath()

		// Events handling

		const mouceDownHandle = (e: MouseEvent) => {
			if (e.which !== 1) return
			if (store.mode === 'view' && store.points?.length > 1) return

			const point = new Point({ x: e.pageX, y: e.pageY, setPoints, pointsStore: store })
			setPoints(state => {
				state.forEach(item => (item.active = false))
				return [...state, point]
			})

			store.creatingPoint = point
		}

		const mouceUpHandle = () => {
			store.creatingPoint = null
		}

		const MIN_OFFSET = 5
		const mounceMoveHandle = (e: MouseEvent) => {
			const creatingPoint = store.creatingPoint
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
			}
		}

		window.addEventListener('mousedown', mouceDownHandle)
		window.addEventListener('mouseup', mouceUpHandle)
		window.addEventListener('mousemove', mounceMoveHandle)

		return () => {
			window.removeEventListener('resize', reszieHandle)

			window.removeEventListener('keypress', keypressHandle, { capture: true })

			window.removeEventListener('mousedown', mouceDownHandle)
			window.removeEventListener('mouseup', mouceUpHandle)
			window.removeEventListener('mousemove', mounceMoveHandle)
		}
	}, [])
	useEffect(() => {
		debounceSave(points, closedPath)
	}, [points, closedPath])

	return (
		<div className='relative h-screen w-screen overflow-hidden'>
			{init && (
				<>
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

					<svg
						viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
						fill='none'
						className='relative h-full w-full select-none'
						xmlns='http://www.w3.org/2000/svg'>
						<path d={d} stroke='hsl(0 0% 20%)' strokeWidth={3} strokeLinejoin='round' />

						{points.map((item, index) => (
							<PointComponent key={item.uid} point={item} mode={mode} />
						))}
					</svg>
				</>
			)}

			<Paper d={d} points={points} setPoints={setPoints} staticize={staticize} totalLength={totalLength} mode={mode} setMode={setMode} />

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
