import { motion } from 'motion/react'
import { useState } from 'react'
import { store } from './main'
import { pointsToJSON } from '@/lib/storage'
import { Checkbox } from '@/components/checkbox-rect'
import { v4 as uuidv4 } from 'uuid'

export default function NameDialog() {
	const [name, setName] = useState(store.name)
	const [another, setAnother] = useState(false)

	const confirm = () => {
		store.name = name
		store.setNameOpen(false)
		if (another) {
			store.uid = uuidv4()
		}

		const index = store.records.findIndex(item => item.uid === store.uid)
		if (index > -1) {
			store.records.splice(index, 1)
		}

		const record = {
			uid: store.uid,
			name: store.name,
			points: pointsToJSON(store.points),
			d: store.d,
			theD: store.theD,
			closedPath: store.closedPath,
			timestamp: Date.now()
		}
		store.setRecords(() => [record, ...store.records])
	}

	return (
		<motion.div
			initial={{ backgroundColor: 'rgb(0 0 0 / 0)' }}
			animate={{ backgroundColor: 'rgb(0 0 0 / 0.6)' }}
			className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80'>
			<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className='w-[320px] rounded-lg bg-white p-4'>
				Name
				<input
					value={name}
					onKeyDown={e => {
						if (e.code === 'Escape') {
							store.setNameOpen(false)
						}
						if (e.code === 'NumpadEnter' || e.code == 'Enter') {
							confirm()
						}
					}}
					onInput={e => {
						setName((e.target as any).value)
					}}
					autoFocus
					placeholder='Untitled'
					className='mt-3 block w-full rounded border bg-gray-100 p-2 font-normal'
				/>
				<div className='mt-2 flex items-center gap-1 text-xs font-normal text-secondary'>
					<Checkbox checked={another} onClick={() => setAnother(s => !s)} /> <span>Save as a new record</span>
				</div>
				<div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
					<button onClick={() => store.setNameOpen(false)} className='rounded border bg-gray-50 py-1.5 font-normal text-secondary'>
						Cancel
					</button>
					<button onClick={confirm} className='rounded bg-brand py-1.5 text-white'>
						Save
					</button>
				</div>
			</motion.div>
		</motion.div>
	)
}
