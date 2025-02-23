import { ReactNode } from 'react'

interface Props {
	children?: ReactNode
	staticize: Function
}

export default function Buttons({ children, staticize }: Props) {
	return (
		<div
			onMouseDown={e => {
				e.stopPropagation()
				staticize()
			}}
			className='fixed bottom-8 right-12 flex gap-3 rounded-lg bg-white p-3 shadow'>
			{children}
		</div>
	)
}
