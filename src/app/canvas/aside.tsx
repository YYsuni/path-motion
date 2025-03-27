import CursorSVG from '@/svgs/cursor.svg'
import SettingSVG from '@/svgs/setting.svg'
import clsx from 'clsx'
import AsideDesign from './aside-design'
import AsideSetting from './aside-setting'
import { store } from './main'

export default function Aside() {
	return (
		<div className='p-6'>
			<ul className='grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1 text-xs text-secondary'>
				<li
					onClick={() => store.setTab('design')}
					className={clsx('flex cursor-pointer items-center justify-center rounded-md p-1', store.tab == 'design' && 'bg-white text-primary')}>
					<CursorSVG className='mr-1 h-4 w-4' />
					<span>Design</span>
				</li>
				<li
					onClick={() => store.setTab('setting')}
					className={clsx('flex cursor-pointer items-center justify-center rounded-md p-1', store.tab == 'setting' && 'bg-white text-primary')}>
					<SettingSVG className='mr-1 h-4 w-4' />
					<span>Setting</span>
				</li>
			</ul>
			<div className='mt-6 space-y-9'>
				{store.tab === 'design' && <AsideDesign />}
				{store.tab === 'setting' && <AsideSetting />}
			</div>
		</div>
	)
}
