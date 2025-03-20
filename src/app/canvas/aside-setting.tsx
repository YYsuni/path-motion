import Checkbox from '@/components/checkbox'
import { store } from './main'
import { useRef, useState } from 'react'
import { fixNumber, pathToPoints } from '@/lib/utils'
import { motion } from 'motion/react'
import PrevSVG from '@/svgs/prev.svg'
import NextSVG from '@/svgs/next.svg'

export default function AsideSetting() {
	const [originIndex, setOriginIndex] = useState(-1)

	const [enableImport, setEnableImport] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	return (
		<>
			<div className='mt-9 rounded-lg bg-gray-100 p-3 text-sm'>
				<div className='flex items-center'>
					<div className='text-md mr-1 flex h-5 w-5 items-center justify-center self-start text-[#999]'>#</div>
					<div>
						<div>Canvas</div>
						<div className='text-xs font-normal text-[#999]'>add a paper in the center</div>
					</div>
					<Checkbox className='ml-auto' checked={store.enableCanvas} setChecked={store.setEnableCanvas} />
				</div>
				{store.enableCanvas && (
					<div className='mt-3 grid grid-cols-2 gap-3 px-3 text-secondary'>
						<div className='relative flex items-center'>
							<span className='pointer-events-none absolute left-2 text-black/20'>W:</span>
							<input
								className='w-full rounded border bg-gray-200 px-2 py-1 pl-8 focus-visible:outline-none'
								value={store.canvasWidth}
								onInput={e => {
									const value = +(e.target as any).value
									store.setCanvasSize(([w, h]) => [value, h])
								}}
							/>
						</div>
						<div className='relative flex items-center'>
							<span className='pointer-events-none absolute left-2 text-black/20'>H:</span>
							<input
								className='w-full rounded border bg-gray-200 px-2 py-1 pl-8 focus-visible:outline-none'
								value={store.canvasHeight}
								onInput={e => {
									const value = +(e.target as any).value
									store.setCanvasSize(([w, h]) => [w, value])
								}}
							/>
						</div>
					</div>
				)}
			</div>

			<h3 className='mt-9 px-3 text-sm'>
				Origin{' '}
				<span className='text-xs text-black/40'>
					({store.origin[0]}, {store.origin[1]})
				</span>
			</h3>
			<div className='mt-3 flex gap-1'>
				<button
					onClick={() => {
						setOriginIndex(-2)
						store.setOrigin([0, 0])
					}}
					className='cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
					Screen Left Top
				</button>
				{store.enableCanvas && (
					<button
						onClick={() => {
							const canvasElement = document.getElementById('canvas')
							if (canvasElement) {
								const { left, top } = canvasElement.getBoundingClientRect()

								setOriginIndex(-1)
								store.setOrigin([fixNumber(left), fixNumber(top)])
							}
						}}
						className='cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
						Canvas Left Top
					</button>
				)}
			</div>

			{store.points.length > 0 && (
				<div className='mt-3 flex gap-1'>
					<button
						onClick={() => {
							if (store.points[0]) store.setOrigin([store.points[0].x, store.points[0].y])
						}}
						className='cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
						First point
					</button>
					<button
						onClick={() => {
							const points = store.points
							const index = originIndex < 0 ? 0 : originIndex === 0 ? points.length - 1 : (originIndex - 1) % points.length
							setOriginIndex(index)
							store.setOrigin([points[index].x, points[index].y])
						}}
						className='cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
						<PrevSVG className='h-5 w-5' />
					</button>
					<button
						onClick={() => {
							const points = store.points
							const index = originIndex < 0 ? 0 : (originIndex + 1) % points.length
							setOriginIndex(index)
							store.setOrigin([points[index].x, points[index].y])
						}}
						className='cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
						<NextSVG className='h-5 w-5' />
					</button>
					<button
						onClick={() => {
							const points = store.points
							if (points[0]) store.setOrigin([points[points.length - 1].x, points[points.length - 1].y])
						}}
						className='cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
						Last point
					</button>
				</div>
			)}

			<div className='mt-9 rounded-lg bg-gray-100 p-3 text-sm'>
				<div className='flex items-center'>
					<div className='mr-1 flex h-5 w-5 items-center justify-center self-start text-lg text-[#999]'>“</div>
					<div>
						<div>Import</div>
						<div className='text-xs font-normal text-[#999]'>import data</div>
					</div>
					<Checkbox className='ml-auto' checked={enableImport} setChecked={setEnableImport} />
				</div>
				{enableImport && (
					<div className='mt-3 px-3'>
						<textarea
							ref={textareaRef}
							className='f w-full resize-none break-all rounded-md bg-gray-200 p-2 text-xs font-normal focus:outline-none'
							rows={5}
							placeholder='M942.29,455.86 C942.29,455.86 985.71,310.14 1095.43,392.43 C1244.57,509 936,676 936,676 C936,676 643.43,496.43 788.57,386.71 C895.43,324.43 942.29,455.86 942.29,455.86 '
						/>
						<div className='mt-1 text-right'>
							<button
								onClick={() => {
									const result = pathToPoints(textareaRef.current!.value)

									if (result && result.length > 1) {
										const [points, closedPath] = result

										if (points && points.length) {
											store.setPoints(points)
											if (closedPath) store.setClosedPath(true)
										}
									}
								}}
								className='cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
								Import
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	)
}
