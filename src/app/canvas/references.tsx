import { Dispatch, memo } from 'react'
import { create } from 'zustand'

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
			{refers.map(item => {
				if (item.type === 'rect') {
					return <rect key={item.uid} width={item.width} height={item.height} stroke='black' />
				}

				return null
			})}
		</>
	)
}

export default memo(References)
