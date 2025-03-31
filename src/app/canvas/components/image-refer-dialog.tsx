import clsx from 'clsx'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ImgSVG from '@/svgs/img.svg'
import { useReferStore } from './references'

interface Props {
	setOpen: any
}

export default function ImageReferDialog({ setOpen }: Props) {
	const { refers, setRefers } = useReferStore()

	const [url, setURL] = useState('')
	const [tab, setTab] = useState<'local' | 'url'>('local')

	const fileInputRef = useRef<HTMLInputElement>(null)
	const [localURL, setLocalURL] = useState('')

	let available = false
	let src = ''

	if (tab === 'local' && localURL) {
		available = true
		src = localURL
	} else if (tab === 'url' && url) {
		available = true
		src = url
	}

	return (
		<motion.div
			initial={{ backgroundColor: 'rgb(0 0 0 / 0)' }}
			animate={{ backgroundColor: 'rgb(0 0 0 / 0.6)' }}
			className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80'>
			<motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className='w-[320px] rounded-lg bg-white p-4'>
				<h3>
					Add image [
					<span className='cursor-pointer font-normal'>
						<span onClick={() => setTab('local')} className={clsx('', tab === 'local' && 'text-brand')}>
							local
						</span>
						/
						<span onClick={() => setTab('url')} className={clsx('', tab === 'url' && 'text-brand')}>
							url
						</span>
						]
					</span>
				</h3>

				{tab === 'local' && (
					<>
						<div
							onClick={() => fileInputRef.current!.click()}
							className='mt-3 flex min-h-[80px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border bg-gray-100 text-center'>
							{localURL ? <img className='max-h-[200px] max-w-full object-cover' src={localURL} /> : <ImgSVG className='mx-auto h-5 w-5' />}
						</div>

						<input
							onChange={() => {
								const file = fileInputRef.current!.files?.[0]

								if (file) {
									const src = URL.createObjectURL(file)
									setLocalURL(src)
								}
							}}
							ref={fileInputRef}
							type='file'
							accept='image/*'
							className='hidden'
						/>
					</>
				)}

				{tab === 'url' && (
					<input
						value={url}
						onInput={e => {
							setURL((e.target as any).value)
						}}
						placeholder='URL'
						className='mt-3 block w-full rounded border bg-gray-100 p-2 font-normal'
					/>
				)}

				<div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
					<button
						onClick={() => {
							URL.revokeObjectURL(localURL)
							setOpen(false)
						}}
						className='rounded border bg-gray-50 py-1.5 font-normal text-secondary'>
						Cancel
					</button>
					<button
						onClick={() => {
							if (available) {
								setRefers([...refers, { uid: uuidv4(), type: 'image', src, width: 200, height: 200, x: 0, y: 0 }])
								setOpen(false)
							}
						}}
						className={clsx('rounded py-1.5 text-white', available ? 'bg-brand' : 'cursor-not-allowed bg-gray-300')}>
						Confirm
					</button>
				</div>
			</motion.div>
		</motion.div>
	)
}
