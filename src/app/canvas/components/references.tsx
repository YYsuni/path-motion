import { Dispatch, memo } from 'react'
import { create } from 'zustand'
import Reference from './reference'

export const useReferStore = create<{
	refers: any[]
	setRefers: Dispatch<any[]>

	enable: boolean
	setEnable: Dispatch<boolean>
}>(set => ({
	refers: [] as any[],
	setRefers: (refers: any[]) => set((state: any) => ({ ...state, refers })),

	enable: false,
	setEnable: (enable: boolean) => set((state: any) => ({ ...state, enable }))
}))

function References() {
	const { refers, setRefers, enable, setEnable } = useReferStore()

	return (
		<>
			{refers.map(item => (
				<Reference shape={item} key={item.uid} />
			))}
		</>
	)
}

export default memo(References)
