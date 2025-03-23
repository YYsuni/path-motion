import { fixNumber, pathToPoints, pointsToPath } from '@/lib/utils'
import { memo } from 'react'

interface Props {
	d: string
	className?: string
}

function PreviewD_({ d, className }: Props) {
	const pointsResult = pathToPoints(d)!

	if (pointsResult) {
		const points = pointsResult[0]

		let minX = Infinity,
			maxX = -Infinity,
			minY = Infinity,
			maxY = -Infinity

		for (const point of points) {
			if (point.x < minX) minX = point.x
			if (point.x > maxX) maxX = point.x
			if (point.y < minY) minY = point.y
			if (point.y > maxY) maxY = point.y
		}

		const padding = +((maxX - minX) / 4).toFixed(0)

		const offetX = (maxX - minX + 2 * padding).toFixed(0),
			offsetY = (maxY - minY + 2 * padding).toFixed(0)

		for (const point of points) {
			point.x += -minX + padding
			point.preControlPoint.x += -minX + padding
			point.postControlPoint.x += -minX + padding
			point.y = point.y - minY + padding
			point.preControlPoint.y += -minY + padding
			point.postControlPoint.y += -minY + padding
		}

		return (
			<svg viewBox={`0 0 ${offetX} ${offsetY}`} fill='none' className={className} xmlns='http://www.w3.org/2000/svg'>
				<defs>
					<radialGradient id={'gradient'} cx='0%' cy='0%' r='100%' gradientUnits='userSpaceOnUse'>
						<stop offset='0%' stopColor='#23D093' />
						<stop offset='75%' stopColor='#AFABF6' />
						<stop offset='100%' stopColor='#4CC8F3' />
					</radialGradient>
				</defs>

				<path d={pointsToPath(points)} stroke='url(#gradient)' strokeWidth={(+offetX / 50).toFixed(1)} strokeLinecap='round' />
			</svg>
		)
	}
}

export default memo(PreviewD_)
