import { store } from '../main'
import dayjs from 'dayjs'
import PreviewD from '@/components/preview-d'
import { jsonToPoints } from '@/lib/storage'
import { memo } from 'react'

interface Props {
	records: PathRecord[]
}

function AsideDesignRecords({ records }: Props) {
	return (
		<section>
			<h3 className='px-3 text-sm'>Records</h3>

			<ul className='mt-3 space-y-1 text-sm'>
				{records.map((item, i) => (
					<li key={item.uid} className='flex items-center rounded-lg bg-gray-100 p-3'>
						<div className='mr-3 flex h-8 w-10 shrink-0 items-center justify-center rounded border bg-white'>
							<PreviewD d={item.theD} />
						</div>
						<div>
							<div className='max-w-[100px] overflow-hidden text-ellipsis text-sm'>{item.name}</div>
							<div className='text-xs font-normal text-secondary'>{dayjs(item.timestamp).format('HH:mm MM/D/YY')}</div>
						</div>
						<div className='ml-auto flex w-[60px] flex-col gap-0.5 text-center text-xs font-normal'>
							<button
								onClick={() => {
									store.uid = item.uid
									store.name = item.name
									store.closedPath = item.closedPath

									store.setPoints(jsonToPoints(item.points) || [])
									const [record] = records.splice(i, 1)
									store.setRecords([record, ...records])
								}}
								className='w-full rounded border bg-gray-50 py-0.5 hover:bg-gray-100 active:bg-gray-200'>
								Apply
							</button>
							<button
								onClick={() => {
									records.splice(i, 1)
									store.setRecords(s => [...records])
								}}
								className='w-full rounded border bg-gray-50 py-0.5 hover:bg-gray-100 active:bg-gray-200'>
								Delete
							</button>
						</div>
					</li>
				))}
			</ul>
		</section>
	)
}

export default memo(AsideDesignRecords)
