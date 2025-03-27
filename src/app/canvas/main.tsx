'use client'

import { CanvasMode, MouseMode } from '@/consts'
import { Point } from '@/lib/point'
import { isBetween, pointsToPath } from '@/lib/utils'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Aside from './aside'
import { debounceSave, getLocalMeta, getLocalPoints, getLocalRecords, getStorage, saveRecords, setStorage } from '@/lib/storage'
import { motion } from 'motion/react'
import PointComponent from '@/components/point'
import Toolbar from './toolbar'
import { v4 as uuidv4 } from 'uuid'
import NameDialog from './name-dialog'
import References from './components/references'
import clsx from 'clsx'

export const store = {
	uid: '',
	name: '',

	tab: 'design' as 'design' | 'setting',
	setTab: (() => {}) as Dispatch<SetStateAction<'design' | 'setting'>>,

	points: [] as Point[],
	setPoints: (() => {}) as Dispatch<SetStateAction<Point[]>>,
	closedPath: false,
	setClosedPath: (() => {}) as Dispatch<SetStateAction<boolean>>,
	showArrow: false,
	setShowArrow: (() => {}) as Dispatch<SetStateAction<boolean>>,
	d: '',
	theD: '',
	totalLength: 0,
	origin: [0, 0],
	setOrigin: (() => {}) as Dispatch<SetStateAction<number[]>>,
	activePoint: undefined as undefined | Point,

	canvasMode: 'normal' as CanvasMode,
	setCanvasMode: ((c: CanvasMode) => {}) as Dispatch<SetStateAction<CanvasMode>>,

	mouseMode: 'create' as MouseMode,
	setMouseMode: ((m: MouseMode) => {}) as Dispatch<SetStateAction<MouseMode>>,

	creatingPoint: null as Point | null,
	selectStart: null as { x: number; y: number } | null,
	selectedPoints: null as null | Point[],

	enableCanvas: false,
	setEnableCanvas: (() => {}) as Dispatch<SetStateAction<boolean>>,
	canvasWidth: 0,
	canvasHeight: 0,
	setCanvasSize: (() => {}) as Dispatch<SetStateAction<[number, number]>>,

	nameOpen: false,
	setNameOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
	records: [] as PathRecord[],
	setRecords: (() => {}) as Dispatch<SetStateAction<PathRecord[]>>
}

const ORIGIN_RADIUS = 10000
const ORIGIN_WIDTH = 1
const ORIGIN_COLOR = '#9996'
let originTimer: NodeJS.Timeout | undefined

export default function Main() {
	const [init, setInit] = useState(false)
	const mainRef = useRef<HTMLElement>(null)
	const [[mainWidth, mainHeight], setMainSize] = useState([0, 0])

	const [tab, setTab] = useState<'design' | 'setting'>('design')

	const [enableCanvas, setEnableCanvas] = useState(false)
	const [[canvasWidth, canvasHeight], setCanvasSize] = useState([900, 600])
	const [mouseDown, setMouseDown] = useState(false)

	// Canvas canvasMode
	const [canvasMode, setCanvasMode] = useState<CanvasMode>('normal')
	const [mouseMode, setMouseMode] = useState<MouseMode>('create')

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

	const staticize = useCallback(() => {
		store.points.forEach(item => (item.active = false))
		setPoints([...store.points])
	}, [])

	const activePoint = points.find(item => item.active)

	const [closedPath, setClosedPath] = useState(false)

	const endPoint = points.length > 2 && closedPath ? points[0] : points[points.length - 1]

	const [showArrow, setShowArrow] = useState(false)

	// Path d
	const d = pointsToPath(points, closedPath)
	const pathRef = useRef<SVGPathElement>(null)
	const theD = origin[0] != 0 || origin[1] != 0 ? pointsToPath(points, closedPath, origin) : d
	const totalLength = pathRef.current?.getTotalLength() || 0

	// Select
	const [selectedRect, setSelectedRect] = useState<{ x: number; y: number }[] | null>(null)
	const betterSelectedRect = useMemo(
		() =>
			selectedRect
				? [
						{ x: Math.min(selectedRect[0].x, selectedRect[1].x), y: Math.min(selectedRect[0].y, selectedRect[1].y) },
						{ x: Math.max(selectedRect[0].x, selectedRect[1].x), y: Math.max(selectedRect[0].y, selectedRect[1].y) }
					]
				: null,
		[selectedRect]
	)

	const [nameOpen, setNameOpen] = useState(false)
	const [records, setRecords] = useState<PathRecord[]>([])

	// Store values
	{
		store.tab = tab
		store.setTab = setTab
		store.enableCanvas = enableCanvas
		store.setEnableCanvas = setEnableCanvas
		store.canvasWidth = canvasWidth
		store.canvasHeight = canvasHeight
		store.setCanvasSize = setCanvasSize
		store.canvasMode = canvasMode
		store.mouseMode = mouseMode
		store.setMouseMode = setMouseMode
		store.setCanvasMode = setCanvasMode
		store.closedPath = closedPath
		store.setClosedPath = setClosedPath
		store.points = points
		store.setPoints = setPoints
		store.showArrow = showArrow
		store.setShowArrow = setShowArrow
		store.d = d
		store.theD = theD
		store.totalLength = totalLength
		store.origin = origin
		store.setOrigin = setOrigin
		store.activePoint = activePoint
		store.nameOpen = nameOpen
		store.setNameOpen = setNameOpen
		store.records = records
		store.setRecords = setRecords
	}

	useEffect(() => {
		setInit(true)

		store.uid = uuidv4()

		// Init points and records from local storage
		const localPoints = getLocalPoints()
		if (localPoints) setPoints(localPoints)
		const localMeta = getLocalMeta()
		if (localMeta) setClosedPath(true)
		const records = getLocalRecords()
		if (records) setRecords(records)

		// Init modes from local storage
		const localCanvasMode = getStorage('canvasMode')
		const localMouseMode = getStorage('mouseMode')
		if (localCanvasMode) setCanvasMode(localCanvasMode as any)
		if (localMouseMode) setMouseMode(localMouseMode as any)

		// Init canvas sizes from local storage
		const cw = getStorage('canvas-width')!
		const ch = getStorage('canvas-height')!
		const enableCanvas = getStorage('enableCanvas') == 'true'
		setEnableCanvas(enableCanvas)
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
			if (!((e.target as HTMLElement).tagName == 'svg' && (e.target as HTMLElement).id === 'board')) return

			if (e.which !== 1) return

			staticize()

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
			if (!((e.target as HTMLElement).tagName == 'svg' && (e.target as HTMLElement).id === 'board')) return
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
					creatingPoint.initControlPoints()
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

			mainRef.current?.removeEventListener('mousedown', mouseDownHandle)
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
	useEffect(() => {
		setStorage('enableCanvas', String(enableCanvas))
		setStorage('canvas-width', String(canvasWidth))
		setStorage('canvas-height', String(canvasHeight))
	}, [canvasHeight, canvasWidth, enableCanvas])
	useEffect(() => {
		saveRecords(records)
	}, [records])

	// Actions
	const selectedPoints = useMemo(() => {
		if (betterSelectedRect) {
			const selectedPoints = store.points.filter(
				item => isBetween(item.x, betterSelectedRect[0].x, betterSelectedRect[1].x) && isBetween(item.y, betterSelectedRect[0].y, betterSelectedRect[1].y)
			)
			return selectedPoints
		}
	}, [betterSelectedRect])
	store.selectedPoints = selectedPoints || null
	const deleteHandle = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Delete' || e.code === 'Backspace') {
				activePoint?.deleteSelf()
				store.points.forEach(point => {
					if (point.active) {
						point.deleteSelf()
					}
				})

				if (betterSelectedRect) {
					const unselectedPoints = store.points.filter(
						item =>
							!(isBetween(item.x, betterSelectedRect[0].x, betterSelectedRect[1].x) && isBetween(item.y, betterSelectedRect[0].y, betterSelectedRect[1].y))
					)
					setPoints(unselectedPoints)
				}
			}
		},
		[betterSelectedRect]
	)

	return (
		<div className='flex h-full overflow-hidden'>
			<main
				ref={mainRef}
				className='pattern-bg relative flex flex-1 items-center justify-center overflow-hidden bg-[#F5F5F5] focus-visible:outline-none'
				tabIndex={1}
				onKeyDown={deleteHandle as any}>
				{enableCanvas && !!canvasWidth && !!canvasHeight && (
					<motion.div
						id='canvas'
						className='pointer-events-none absolute border bg-white/60'
						initial={{ width: canvasWidth, height: canvasHeight }}
						animate={{ width: canvasWidth, height: canvasHeight }}></motion.div>
				)}

				<div className={clsx(tab == 'design' && 'pointer-events-none opacity-60')}>
					<References />
				</div>

				{init && (
					<svg
						id='board'
						viewBox={`0 0 ${mainWidth} ${mainHeight}`}
						fill='none'
						className={clsx('relative h-full w-full select-none', tab == 'setting' && 'pointer-events-none opacity-40')}
						xmlns='http://www.w3.org/2000/svg'>
						<defs>
							<radialGradient id='gradient' cx='0%' cy='0%' r='100%' gradientUnits='userSpaceOnUse'>
								<stop offset='0%' stopColor='#23D093' />
								<stop offset='75%' stopColor='#AFABF6' />
								<stop offset='100%' stopColor='#4CC8F3' />
							</radialGradient>
						</defs>

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

						<path ref={pathRef} d={d} stroke='url(#gradient)' id='path' strokeWidth={2.5} strokeLinejoin='round' />

						<g>
							{points.map(item => (
								<PointComponent key={item.uid} point={item} canvasMode={canvasMode} />
							))}
						</g>
					</svg>
				)}

				{showArrow && points.length > 1 && (
					<svg
						style={{
							left: endPoint.x - 16,
							top: endPoint.y,
							rotate: endPoint.getAngle() + 'deg'
						}}
						className='pointer-events-none fixed w-8 origin-top'
						viewBox='0 0 136 103'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path d='M128 95C128 95 87.2365 8.00012 67.9997 8C48.7629 7.99988 8 95 8 95' stroke='#006aeb' strokeWidth='12' />
					</svg>
				)}

				{betterSelectedRect && mouseDown && (
					<div
						className='fixed border-[1.5px] border-brand/80 bg-brand/10'
						style={{
							left: betterSelectedRect[0].x,
							top: betterSelectedRect[0].y,
							width: betterSelectedRect[1].x - betterSelectedRect[0].x,
							height: betterSelectedRect[1].y - betterSelectedRect[0].y
						}}></div>
				)}

				<Toolbar />
			</main>

			<aside className='w-[300px] overflow-auto bg-[#F9F9F9] shadow-xl shadow-gray-200'>
				<Aside />
			</aside>

			{nameOpen && <NameDialog />}
		</div>
	)
}
