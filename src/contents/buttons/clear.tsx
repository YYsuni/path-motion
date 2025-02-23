import { memo } from 'react'
import EraserSVG from '@/svgs/buttons/eraser.svg'

interface Props {
	clear: Function
}

function Clear({ clear }: Props) {
	return (
		<button onMouseDown={e => e.stopPropagation()} onClick={() => clear()} className='rounded-md bg-white px-3 py-1 hover:bg-gray-100'>
			<EraserSVG className='h-5 w-5' />
		</button>
	)
}

export default memo(Clear)
