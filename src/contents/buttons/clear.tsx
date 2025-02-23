import { memo } from 'react'
import EraserSVG from '@/svgs/buttons/eraser.svg'

interface Props {
	clear: () => void
}

function Clear({ clear }: Props) {
	return (
		<button onClick={clear} className='flex-1 rounded-md px-3 py-1 hover:bg-gray-100'>
			<EraserSVG className='h-5 w-5' />
		</button>
	)
}

export default memo(Clear)
