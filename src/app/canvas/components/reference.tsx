import { Shape } from '@/consts'
import { useEffect, useRef, useState } from 'react'

interface Props {
	shape: Shape
}

export default function Reference({ shape }: Props) {
	const [data, setData] = useState(shape)
	Object.assign(shape, data)

	const ref = useRef<{ active: boolean; x: number; y: number; startX: number; startY: number }>({ active: false, x: 0, y: 0, startX: 0, startY: 0 })

	useEffect(() => {
		const moveHandle = (e: MouseEvent) => {
			if (ref.current.active) {
				setData(s => ({ ...s, x: e.pageX - ref.current.x + ref.current.startX, y: e.pageY - ref.current.y + ref.current.startY }))
			}
		}
		const upHandle = () => {
			ref.current.active = false
		}

		window.addEventListener('mousemove', moveHandle)
		window.addEventListener('mouseup', upHandle)

		return () => {
			window.removeEventListener('mousemove', moveHandle)
			window.removeEventListener('mouseup', upHandle)
		}
	}, [])

	if (shape.type === 'rect') {
		return (
			<div
				onMouseDown={e => {
					ref.current.active = true
					ref.current.x = e.pageX
					ref.current.y = e.pageY
					ref.current.startX = data.x
					ref.current.startY = data.y
				}}
				onMouseUp={() => (ref.current.active = false)}
				style={{ width: data.width, height: data.height, top: data.y, left: data.x }}
				className='absolute border-2 border-gray-400'
			/>
		)
	}
	return null
}
