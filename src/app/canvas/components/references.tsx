import { Dispatch, memo, useEffect } from 'react'
import { create } from 'zustand'
import Reference from './reference'
import { Shape } from '@/consts'
import { getStorage, setStorage } from '@/lib/storage'

export const useReferStore = create<{
	refers: Shape[]
	setRefers: Dispatch<any[]>

	enable: boolean
	setEnable: Dispatch<boolean>
}>(set => ({
	refers: [] as any[],
	setRefers: (refers: any[]) => set((state: any) => ({ ...state, refers })),

	enable: false,
	setEnable: (enable: boolean) => set((state: any) => ({ ...state, enable }))
}))

let active = false
let _refers: any[] = []

function References() {
	const { refers, setRefers, enable, setEnable } = useReferStore()
	_refers = refers

	useEffect(() => {
		if (active) {
			setStorage('refer-enable', String(enable))
			setStorage('refers', JSON.stringify(refers))
		}
	}, [refers, enable])

	useEffect(() => {
		setRefers(JSON.parse(getStorage('refers')!))
		setEnable(getStorage('refer-enable')! === 'true')
		active = true

		const upHandle = () => {
			setRefers([..._refers])
		}

		window.addEventListener('mouseup', upHandle)

		return () => {
			window.removeEventListener('mouseup', upHandle)
		}
	}, [])

	if (enable)
		return (
			<>
				{refers.map(item => (
					<Reference shape={item} key={item.uid} />
				))}
			</>
		)

	return null
}

export default memo(References)
