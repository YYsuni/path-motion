import ClosePathSVG from '@/svgs/buttons/close-path.svg'
import clsx from 'clsx'

interface Props {
	closePath: () => void
	closedPath: boolean
}

export default function ClosePath({ closePath, closedPath }: Props) {
	return (
		<button onClick={closePath} className={clsx('flex-1 rounded-md px-3 py-1', closedPath ? 'text-brand bg-brand/10' : 'hover:bg-gray-100')}>
			<ClosePathSVG className='h-5 w-5' />
		</button>
	)
}
