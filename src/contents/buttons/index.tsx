import { ReactNode } from 'react'

interface Props {
	children?: ReactNode
}

export default function Buttons({ children }: Props) {
	return <div className='fixed bottom-8 right-12 flex gap-3'>{children}</div>
}
