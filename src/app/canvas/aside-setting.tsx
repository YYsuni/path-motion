import Checkbox from '@/components/checkbox'
import { store } from './main'
import { useState } from 'react'
import { fixNumber } from '@/lib/utils'
import PrevSVG from '@/svgs/prev.svg'
import NextSVG from '@/svgs/next.svg'
import AsideSettingReference from './components/aside-setting-reference'
import AsideSettingImport from './components/aside-setting-import'

export default function AsideSetting() {
	const [originIndex, setOriginIndex] = useState(-1)

	return (
		<>
			<section>
				<h3 className='px-3 text-sm'>
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
			</section>

			<div className='space-y-3'>
				<section className='rounded-lg bg-gray-100 p-3 text-sm'>
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
				</section>

				<AsideSettingReference />

				<AsideSettingImport />
			</div>
		</>
	)
}
