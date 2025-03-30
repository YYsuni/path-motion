import Checkbox from '@/components/checkbox'
import { useReferStore } from './references'
import { v4 as uuidv4 } from 'uuid'
import { memo } from 'react'
import clsx from 'clsx'

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
				<>
					<div className='mt-3 flex select-none gap-1 px-3'>
						<button
							onClick={() => setRefers([...refers, { uid: uuidv4(), type: 'rect', width: 200, height: 200, x: 0, y: 0 }])}
							className='rounded border p-2 hover:bg-gray-200'>
							<div className='h-4 w-4 border-2 border-secondary'></div>
						</button>
						<button
							onClick={() => setRefers([...refers, { uid: uuidv4(), type: 'circle', width: 200, height: 200, x: 0, y: 0 }])}
							className='rounded border p-2 hover:bg-gray-200'>
							<div className='h-4 w-4 rounded-full border-2 border-secondary'></div>
						</button>
					</div>

					{refers.length > 0 && (
						<ul className='mt-3 space-y-1'>
							{refers.map((item, i) => (
								<li key={item.uid} className='flex items-center rounded-lg border bg-gray-200 px-3 py-1'>
									{item.type === 'rect' ? (
										<div className={clsx('h-4 w-4 border-2', item.active ? 'border-brand' : 'border-secondary')}></div>
									) : (
										<div className={clsx('h-4 w-4 rounded-full border-2', item.active ? 'border-brand' : 'border-secondary')}></div>
									)}

									<div className='ml-3'>
										<div className='text-secondary'>{item.type}</div>
										<div className='text-xs font-normal text-secondary'>
											{item.width} x {item.height}
										</div>
									</div>

									<div className='ml-auto'>
										<button
											onClick={() => {
												refers.splice(i, 1)
												setRefers([...refers])
											}}
											className='w-full rounded border bg-gray-100 px-2 py-0.5 text-xs font-normal hover:bg-gray-100 active:bg-gray-200'>
											Delete
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</>
			)}
		</section>
	)
}

export default memo(AsideSettingReference)
