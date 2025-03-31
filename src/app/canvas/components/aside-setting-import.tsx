import { memo, useRef, useState } from 'react'
import Checkbox from '@/components/checkbox'
import { pathToPoints } from '@/lib/utils'
import { store } from '../main'

function AsideSettingImport() {
	const [enableImport, setEnableImport] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	return (
		<section className='rounded-lg bg-gray-100 p-3 text-sm'>
			<div className='flex items-center'>
				<div className='mr-1 flex h-5 w-5 items-center justify-center self-start text-lg text-[#999]'>“</div>
				<div>
					<div>Import</div>
					<div className='text-xs font-normal text-[#999]'>import data</div>
				</div>
				<Checkbox className='ml-auto' checked={enableImport} setChecked={setEnableImport} />
			</div>
			{enableImport && (
				<div className='mt-3 px-3'>
					<textarea
						ref={textareaRef}
						className='w-full resize-none break-all rounded-md bg-gray-200 p-2 text-xs font-normal focus:outline-none'
						rows={5}
						placeholder='M942.29,455.86 C942.29,455.86 985.71,310.14 1095.43,392.43'
					/>
					<div className='mt-1 text-right'>
						<button
							onClick={() => {
								const result = pathToPoints(textareaRef.current!.value)

								if (result && result.length > 1) {
									const [points, closedPath] = result

									if (points && points.length) {
										store.setPoints(points)
										if (closedPath) store.setClosedPath(true)
									}
								}
							}}
							className='cursor-pointer rounded border p-2 text-center text-xs hover:bg-gray-100 active:bg-gray-200'>
							Import
						</button>
					</div>
				</div>
			)}
		</section>
	)
}

export default memo(AsideSettingImport)
