import { memo } from 'react'

interface Props {
	clear: Function
}

function Clear({ clear }: Props) {
	return (
		<button onClick={() => clear()} className='rounded-md border-[1.5px] border-black bg-white px-3 py-1'>
			Clear
		</button>
	)
}

export default memo(Clear)
