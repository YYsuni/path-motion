import Link from 'next/link'

export default function Home() {
	return (
		<div className='flex h-full flex-col items-center justify-center'>
			<h1 className='text-xl'>Path Motion</h1>
			<Link href='/canvas' className='mt-6 rounded-lg border bg-brand px-4 py-1 text-white'>
				Start
			</Link>
		</div>
	)
}
