import { useState } from 'react'
import CursorSVG from '@/svgs/cursor.svg'
import SettingSVG from '@/svgs/setting.svg'
import clsx from 'clsx'
import AsideDesign from './aside-design'
import AsideSetting from './aside-setting'

export default function Aside() {
	const [tab, setTab] = useState(0)

	return (
		<div className='overflow-auto p-6'>
			<ul className='grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 text-xs text-secondary'>
				<li onClick={() => setTab(0)} className={clsx('flex cursor-pointer items-center justify-center rounded-md p-1', tab == 0 && 'bg-white text-primary')}>
					<CursorSVG className='mr-1 h-4 w-4' />
					<span>Design</span>
				</li>
				<li onClick={() => setTab(1)} className={clsx('flex cursor-pointer items-center justify-center rounded-md p-1', tab == 1 && 'bg-white text-primary')}>
					<SettingSVG className='mr-1 h-4 w-4' />
					<span>Setting</span>
				</li>
			</ul>

			{tab === 0 && <AsideDesign />}
			{tab === 1 && <AsideSetting />}
		</div>
	)
}
