import clsx from 'clsx'

interface Props {
	checked: boolean
	setChecked: any
	className?: string
	style?: React.CSSProperties
}

export default function Checkbox({ checked, setChecked, className, style }: Props) {
	return (
		<div
			onClick={() => {
				setChecked(!checked)
			}}
			style={style}
			className={clsx('relative mr-1.5 w-9 cursor-pointer rounded-full p-0.5', className, checked ? 'bg-success' : 'bg-black/5 dark:bg-[#282828]')}>
			<div className={'relative h-4 w-4 rounded-full bg-[#fcfcfc] transition-[left]'} style={{ left: checked ? 16 : 0 }} />
		</div>
	)
}
