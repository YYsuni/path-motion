import HighlightPathD from '@/components/highlight-path-d'
import { Point } from '@/lib/point'
import { fixNumber, pathToPoints, pointsToPath } from '@/lib/utils'
import { motion } from 'motion/react'
import { Dispatch, SetStateAction, useReducer, useRef, useState } from 'react'
import DocSVG from '@/svgs/doc.svg'
import { CanvasMode, canvasModes, MouseMode, mouseModes } from '@/consts'
import clsx from 'clsx'
import { writeText } from '@/lib/clipboard'

interface Props {
	store: any
	d: string
	points: Point[]
	setPoints: Dispatch<SetStateAction<Point[]>>
	closedPath: boolean
	totalLength: number
	staticize: Function
	canvasMode: CanvasMode
	setCanvasMode: Dispatch<SetStateAction<CanvasMode>>
	mouseMode: MouseMode
	setMouseMode: Dispatch<SetStateAction<MouseMode>>

	origin: number[]
	setOrigin: Dispatch<SetStateAction<number[]>>

	canvasWidth: number
	canvasHeight: number
	setCanvasSize: Dispatch<SetStateAction<[number, number]>>
}

let copyTimer: any = null

const tabs = ['Path', 'Layout', 'Import']

export default function Paper({
	store,
	points,
	d,
	staticize,
	closedPath,
	totalLength,
	setPoints,
	canvasMode,
	setCanvasMode,
	mouseMode,
	setMouseMode,
	origin,
	setOrigin,
	canvasWidth,
	canvasHeight,
	setCanvasSize
}: Props) {
	const [open, triggerOpen] = useReducer(s => !s, true)
	const [copied, setCopied] = useState(false)

	const [originIndex, setOriginIndex] = useState(-1)

	const [tab, setTab] = useState(tabs[0])

	const textareaRef = useRef<HTMLTextAreaElement>(null)

	if (points.length > 0) {
		const theD = origin[0] != 0 || origin[1] != 0 ? pointsToPath(points, closedPath, origin) : d

		return (
			<div
				className='fixed bottom-8 left-8'
				onMouseDown={e => {
					e.stopPropagation()
					staticize()
				}}>
				{open && (
					<motion.div
						initial={{ display: 'none', scale: 0.4 }}
						animate={{ display: 'block', scale: 1 }}
						className='pointer-events-auto w-[400px] origin-bottom-left rounded-lg bg-white/80 p-6 pb-10 text-xs shadow-md backdrop-blur'>
						<ul className='space-y-3'>
							<li>
								<ul className='flex items-center gap-3'>
									{tabs.map(item => (
										<li key={item} onClick={() => setTab(item)} className={clsx('cursor-pointer', tab === item && 'text-brand')}>
											{item}
										</li>
									))}
								</ul>
							</li>

							{tab === tabs[0] && (
								<>
									<li>
										<div>
											Path <span className='rounded bg-gray-100 px-1 font-mono'>d</span> :
										</div>
										<div className='mt-1 max-h-[240px] overflow-auto break-all rounded-md bg-gray-100 p-3 font-mono text-xs text-secondary'>
											<HighlightPathD d={theD} />
										</div>
										<div className='mt-1 flex items-center gap-1.5'>
											<button
												onClick={() => {
													points.forEach(item => {
														item.enablePreControl = true
														item.initPreControlPoint()
														item.enablePostControl = true
														item.enableControlWeld = true
														item.enableControlEqual = true
														item.syncPostControlPoint()
													})
													setPoints([...points])
												}}
												className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
												Smooth
											</button>
											<button
												onClick={() => {
													points.forEach(item => {
														item.enablePreControl = false
														item.enablePostControl = false
													})
													setPoints([...points])
												}}
												className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
												Sharp
											</button>

											<button
												onClick={() => {
													points.forEach(item => {
														item.x = fixNumber(item.x)
														item.y = fixNumber(item.y)
														item.preControlPoint.x = fixNumber(item.preControlPoint.x)
														item.preControlPoint.y = fixNumber(item.preControlPoint.y)
														item.postControlPoint.x = fixNumber(item.postControlPoint.x)
														item.postControlPoint.y = fixNumber(item.postControlPoint.y)
													})
													setPoints([...points])
												}}
												className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
												Minify
											</button>
											<button
												className={clsx('rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200', copied && 'text-brand')}
												onClick={() => {
													clearTimeout(copyTimer)

													writeText(theD)
													setCopied(true)

													copyTimer = setTimeout(() => setCopied(false), 3000)
												}}>
												{copied ? 'Copied!' : 'Copy'}
											</button>
										</div>
									</li>

									<li>
										<div>Path length :</div>
										<div className='mt-1 rounded-md bg-gray-100 p-3 font-mono text-xs text-secondary'>{totalLength}</div>
									</li>
								</>
							)}

							{tab === tabs[1] && (
								<>
									<li>
										<div>Canvas size : </div>
										<div className='mt-1 flex items-center gap-1.5'>
											<input
												className='w-[80px] rounded border px-2 py-1 font-mono focus-visible:border-gray-400 focus-visible:outline-none'
												value={canvasWidth}
												type='number'
												step='1'
												onInput={e => {
													const value = +(e.target as any).value
													setCanvasSize(([w, h]) => [value, h])
												}}
											/>
											<span className='text-secondary'>x</span>

											<input
												className='w-[80px] rounded border px-2 py-1 font-mono focus-visible:border-gray-400 focus-visible:outline-none'
												value={canvasHeight}
												type='number'
												step='1'
												onInput={e => {
													const value = +(e.target as any).value
													setCanvasSize(([w, h]) => [w, value])
												}}
											/>
										</div>
									</li>

									<li>
										<div>
											Coordinate origin :{' '}
											<span className='font-mono text-secondary'>
												({origin[0]}, {origin[1]})
											</span>
										</div>

										<div className='mt-1'>
											<div className='flex items-center gap-1.5'>
												<span className='text-secondary'>Layout :</span>

												<button
													onClick={() => {
														setOriginIndex(-2)
														setOrigin([0, 0])
													}}
													className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
													Screen Left-Top
												</button>
												<button
													onClick={() => {
														const canvasElement = document.getElementById('canvas')
														if (canvasElement) {
															const { left, top } = canvasElement.getBoundingClientRect()

															setOriginIndex(-1)
															setOrigin([fixNumber(left), fixNumber(top)])
														}
													}}
													className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
													Canvas Left-Top
												</button>
											</div>
											<div className='mt-1 flex items-center gap-1.5'>
												<span className='text-secondary'>Point :</span>
												<button
													onClick={() => setOrigin([points[0].x, points[0].y])}
													className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
													First
												</button>
												<button
													onClick={() => {
														const index = originIndex < 0 ? 0 : originIndex === 0 ? points.length - 1 : (originIndex - 1) % points.length
														setOriginIndex(index)
														setOrigin([points[index].x, points[index].y])
													}}
													className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
													Prev
												</button>
												<button
													onClick={() => {
														const index = originIndex < 0 ? 0 : (originIndex + 1) % points.length
														setOriginIndex(index)
														setOrigin([points[index].x, points[index].y])
													}}
													className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
													Next
												</button>
												<button
													onClick={() => setOrigin([points[points.length - 1].x, points[points.length - 1].y])}
													className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
													Last
												</button>
											</div>
										</div>
									</li>
								</>
							)}

							{tab === tabs[2] && (
								<>
									<li>
										<textarea
											ref={textareaRef}
											className='f w-full resize-none rounded-md border p-1.5 font-mono leading-4 focus:outline-none'
											rows={5}
											placeholder='M942.29,455.86 C942.29,455.86 985.71,310.14 1095.43,392.43 C1244.57,509 936,676 936,676 C936,676 643.43,496.43 788.57,386.71 C895.43,324.43 942.29,455.86 942.29,455.86 '
										/>

										<div className='mt-1 flex items-center gap-1.5'>
											<button
												onClick={() => {
													const result = pathToPoints(textareaRef.current!.value)

													if (result && result.length > 1) {
														const [points, closedPath] = result

														if (points && points.length) {
															points.forEach(item => {
																item.setPoints = setPoints
																item.pointsStore = store
															})

															setPoints(points)
														}
													}
												}}
												className='rounded border px-3 py-1 text-xs hover:bg-gray-100 active:bg-gray-200'>
												Import
											</button>
										</div>
									</li>
								</>
							)}

							<li>
								<div className='flex gap-3'>
									<div>
										<div>Canvas canvasMode :</div>
										<ul className='mt-1 flex items-center divide-x overflow-hidden rounded border text-secondary'>
											{canvasModes.map(item => (
												<li
													onClick={() => setCanvasMode(item)}
													className={clsx('cursor-pointer px-2 py-1', item === canvasMode && 'bg-brand/10 text-brand')}
													key={item}>
													{item}
												</li>
											))}
										</ul>
									</div>
									<div>
										<div>Mouse mode :</div>
										<ul className='mt-1 flex items-center divide-x overflow-hidden rounded border text-secondary'>
											{mouseModes.map(item => (
												<li
													onClick={() => setMouseMode(item)}
													className={clsx('cursor-pointer px-2 py-1', item === mouseMode && 'bg-brand/10 text-brand')}
													key={item}>
													{item}
												</li>
											))}
										</ul>
									</div>
								</div>
							</li>
						</ul>
					</motion.div>
				)}

				<button onClick={triggerOpen} className='absolute bottom-0 left-0 rounded-lg border bg-white p-1'>
					<DocSVG className='h-5 w-5 rounded-full' />
				</button>
			</div>
		)
	}
}
