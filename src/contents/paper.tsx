import HighlightPathD from '@/components/highlight-path-d'
import { Point } from '@/lib/point'
// import JsonView from 'react18-json-view'
// import 'react18-json-view/src/style.css'

interface Props {
	d: string
	points: Point[]
}

export default function Paper({ points, d }: Props) {
	return (
		<div className='fixed bottom-8 left-8 max-w-[400px] rounded-lg border-2 border-gray-500 bg-white/90 p-6 text-sm backdrop-blur-sm'>
			<ul>
				<li>
					<div>
						Path <span className='rounded bg-gray-100 px-1 font-mono'>d</span> :
					</div>
					<div className='text-secondary mt-1 rounded-md bg-gray-100 p-3 text-xs'>
						<HighlightPathD d={d} />
					</div>
				</li>
			</ul>
		</div>
	)
}
