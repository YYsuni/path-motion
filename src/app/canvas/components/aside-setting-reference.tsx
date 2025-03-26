import Checkbox from '@/components/checkbox'
import { useReferStore } from './references'
import { v4 as uuidv4 } from 'uuid'
import { memo } from 'react'

function AsideSettingReference() {
	const { refers, setRefers, enable, setEnable } = useReferStore()

	return (
		<section className='rounded-lg bg-gray-100 p-3 text-sm'>
			<div className='flex items-center'>
				<div className='mr-1 flex h-5 w-5 items-center justify-center self-start text-lg text-[#999]'>~</div>
				<div>
					<div>Reference</div>
					<div className='text-xs font-normal text-[#999]'>add reference images</div>
				</div>
				<Checkbox className='ml-auto' checked={enable} setChecked={setEnable} />
			</div>
			{enable && (
				<div className='mt-3 flex gap-1 px-3'>
					<button
						onClick={() => setRefers([...refers, { uid: uuidv4(), type: 'rect', width: 200, height: 200, x: 0, y: 0 }])}
						className='rounded border bg-white p-2'>
						<div className='h-5 w-5 border-2 border-secondary'></div>
					</button>
				</div>
			)}
		</section>
	)
}

export default memo(AsideSettingReference)
