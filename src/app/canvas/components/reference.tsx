import { useState } from 'react'

interface Props {
	shape: any
}

export default function Reference({ shape }: Props) {
	const [data, setData] = useState(shape)
	Object.assign(shape, data)

	if (shape.type === 'rect') {
		return <div style={{ width: data.width, height: data.height, top: data.y, left: data.x }} className='absolute border-2 border-gray-400' />
	}
	return null
}
