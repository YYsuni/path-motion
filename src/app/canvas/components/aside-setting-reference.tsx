import Checkbox from '@/components/checkbox'
import { useReferStore } from './references'
import { v4 as uuidv4 } from 'uuid'
import { memo, useRef, useState } from 'react'
import clsx from 'clsx'
import ImgSVG from '@/svgs/img.svg'
import ImageReferDialog from './image-refer-dialog'
import DeleteSVG from '@/svgs/delete.svg'
import { Shape } from '@/consts'

function AsideSettingReference() {
	const { refers, setRefers, enable, setEnable } = useReferStore()

	const [imageOpen, setImageOpen] = useState(false)
	const [selectedItem, setSelectedItem] = useState<null | Shape>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

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
							className='flex h-7 w-7 items-center justify-center rounded border border-gray-300 hover:bg-gray-200'>
							<div className='h-3.5 w-3.5 border-[1.5px] border-secondary'></div>
						</button>
						<button
							onClick={() => setRefers([...refers, { uid: uuidv4(), type: 'circle', width: 200, height: 200, x: 0, y: 0 }])}
							className='flex h-7 w-7 items-center justify-center rounded border border-gray-300 hover:bg-gray-200'>
							<div className='h-3.5 w-3.5 rounded-full border-[1.5px] border-secondary'></div>
						</button>
						<button
							onClick={() => {
								setImageOpen(true)
							}}
							className='flex h-7 w-7 items-center justify-center rounded border border-gray-300 hover:bg-gray-200'>
							<ImgSVG className='h-4 w-4' />
						</button>
					</div>

					{refers.length > 0 && (
						<ul className='mt-3 space-y-1'>
							{refers.map((item, i) => (
								<li key={item.uid} className='flex items-center rounded-lg border bg-gray-200 px-3 py-1'>
									{item.type === 'image' ? (
										<ImgSVG className={clsx('h-4 w-4', item.active ? 'text-brand' : 'text-secondary')} />
									) : item.type === 'rect' ? (
										<div className={clsx('h-4 w-4 border-[1.5px]', item.active ? 'border-brand' : 'border-secondary')}></div>
									) : (
										<div className={clsx('h-4 w-4 rounded-full border-[1.5px]', item.active ? 'border-brand' : 'border-secondary')}></div>
									)}

									<div className='ml-3'>
										<div className='text-secondary'>{item.type}</div>
										<div className='text-xs font-normal text-secondary'>
											{item.width} x {item.height}
										</div>
									</div>

									<div className='ml-auto'>
										{item.src && item.src.startsWith('blob:') && (
											<button
												onClick={() => {
													setSelectedItem(item)
													fileInputRef.current!.click()
												}}
												className='mr-1 rounded border bg-gray-100 p-1 text-xs font-normal active:bg-gray-200'>
												<ImgSVG className='h-4 w-4' />
											</button>
										)}

										<button
											onClick={() => {
												refers.splice(i, 1)
												setRefers([...refers])
												if (item.src) URL.revokeObjectURL(item.src)
											}}
											className='rounded border bg-gray-100 p-1 text-xs font-normal hover:text-red-500 active:bg-gray-200'>
											<DeleteSVG className='h-4 w-4' />
										</button>
									</div>
								</li>
							))}
						</ul>
					)}

					<input
						onChange={() => {
							const file = fileInputRef.current!.files?.[0]

							if (file) {
								const src = URL.createObjectURL(file)
								if (selectedItem) {
									if (selectedItem.src) URL.revokeObjectURL(selectedItem.src)
									selectedItem.src = src
									fileInputRef.current!.value = ''
								}
								setRefers([...refers])
							}
						}}
						ref={fileInputRef}
						type='file'
						accept='image/*'
						className='hidden'
					/>

					{imageOpen && <ImageReferDialog setOpen={setImageOpen} />}
				</>
			)}
		</section>
	)
}

export default memo(AsideSettingReference)
