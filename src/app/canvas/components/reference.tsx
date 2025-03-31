import { Shape } from '@/consts'
import { useCallback, useEffect, useRef, useState } from 'react'
import { store } from '../main'
import clsx from 'clsx'
import { useReferStore } from './references'

interface Props {
	shape: Shape
}

interface ReferUtil {
	active: boolean
	resizeActive: boolean
	x: number
	y: number
	startX: number
	startY: number
	startWidth: number
	startHeight: number
}

export default function Reference({ shape }: Props) {
	const { refers, setRefers } = useReferStore()
	const [data, setData] = useState(shape)
	Object.assign(shape, data, { active: shape.active })
	data.active = shape.active

	const activate = useCallback(() => {
		refers.forEach(item => (item.active = false))

		shape.active = true
	}, [refers])

	const ref = useRef<ReferUtil>({ active: false, resizeActive: false, x: 0, y: 0, startX: 0, startY: 0, startWidth: 0, startHeight: 0 })

	useEffect(() => {
		const moveHandle = (e: MouseEvent) => {
			if (ref.current.active) {
				setData(s => ({ ...s, x: e.pageX - ref.current.x + ref.current.startX, y: e.pageY - ref.current.y + ref.current.startY }))
			} else if (ref.current.resizeActive) {
				let width = e.pageX - ref.current.x + ref.current.startWidth
				let height = e.pageY - ref.current.y + ref.current.startHeight
				if (e.shiftKey) {
					width = Math.min(height, width)
					height = width
				}
				setData(s => ({ ...s, width, height }))
			}
		}
		const upHandle = () => {
			ref.current.active = false
			ref.current.resizeActive = false
		}

		window.addEventListener('mousemove', moveHandle)
		window.addEventListener('mouseup', upHandle)

		return () => {
			window.removeEventListener('mousemove', moveHandle)
			window.removeEventListener('mouseup', upHandle)
		}
	}, [])

	if (shape.type === 'rect' || shape.type === 'circle' || shape.type === 'image') {
		return (
			<div
				onMouseDown={e => {
					activate()
					ref.current.active = true
					ref.current.x = e.pageX
					ref.current.y = e.pageY
					ref.current.startX = data.x
					ref.current.startY = data.y
				}}
				onMouseUp={() => (ref.current.active = false)}
				style={{ width: data.width, height: data.height, top: data.y, left: data.x }}
				className={clsx('absolute border-2 border-gray-400', shape.type === 'circle' && 'rounded-full')}>
				{store.tab === 'setting' && data.active && (
					<div
						className={clsx(
							'pointer-events-none z-10 select-none p-1 text-xs text-black/40',
							shape.type === 'circle' && 'flex h-full w-full items-center justify-center'
						)}>
						{data.width}x{data.height}
					</div>
				)}
				{store.tab == 'setting' && data.active && (
					<div
						onMouseDown={e => {
							e.stopPropagation()
							activate()
							ref.current.resizeActive = true
							ref.current.x = e.pageX
							ref.current.y = e.pageY
							ref.current.startWidth = data.width
							ref.current.startHeight = data.height
						}}
						className='absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize border-b-2 border-r-2 border-brand'
					/>
				)}

				{data.type === 'image' && data.src && <img src={data.src} className='absolute inset-0 h-full w-full select-none object-cover' draggable={false} />}
			</div>
		)
	}
	return null
}
