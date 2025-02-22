import { memo } from 'react'

interface Props {
	clear: Function
}

function Clear({ clear }: Props) {
	return (
		<button onMouseDown={e => e.stopPropagation()} onClick={() => clear()} className='rounded-md bg-white px-3 py-1 shadow'>
			Clear
		</button>
	)
}

export default memo(Clear)
