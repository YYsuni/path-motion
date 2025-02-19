import { ReactElement } from 'react'

interface Props {
	d: string
}

export default function HighlightPathD({ d }: Props) {
	const arr: ReactElement[] = []

	let j = 0
	for (let i = 0; i < d.length; i++) {
		if (/[a-zA-Z]/.test(d[i])) {
			if (i > j + 1) {
				arr.push(<span key={'n' + i + j}>{d.slice(j + 1, i)}</span>)
			}
			arr.push(
				<span key={i} className='font-semibold'>
					{d[i]}
				</span>
			)
			j = i
		}
	}
	if (j < d.length) {
		arr.push(<span key={'end'}>{d.slice(j + 1)}</span>)
	}

	return arr
}
