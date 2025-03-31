'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import FaviconSVG from '@/svgs/favicon.svg'
import GithubSVG from '@/svgs/github.svg'

export default function Home() {
	return (
		<div
			className='h-full bg-[#ECF1F6]'
			style={{
				backgroundImage: 'linear-gradient(to bottom right, #ECF1F6 60%, #C7DBF6 80% , #95C1FE 100% )'
			}}>
			<header className='flex h-[72px] items-center px-8 max-md:px-4'>
				<FaviconSVG className='mr-1 h-5 w-5' /> <span className='font-bold'>Path Motion</span>
				<Link href='/' className='ml-12 text-sm hover:text-brand'>
					Home
				</Link>
				<Link href='/canvas' className='ml-8 text-sm hover:text-brand'>
					Canvas
				</Link>
				<a href='https://github.com/YYsuni/path-motion' className='ml-auto flex text-sm items-center hover:text-brand'>
					<GithubSVG className='h-5 w-5 mr-1' />
					github
				</a>
			</header>

			<div className='relative mx-auto max-w-[1200px] p-4 pt-40 max-md:pt-20'>
				<h1 className='text-4xl font-bold'>Path Motion</h1>

				<p className='mt-4 text-lg'>Draw a line casually, and then make it move.</p>

				<div className='mt-12'>
					<Link href='/canvas' className='mt-6 rounded-lg border bg-brand px-8 py-2 font-mono font-semibold uppercase text-white'>
						Let's Start
					</Link>
				</div>

				<div className='pattern-bg absolute right-4 top-20 flex h-[300px] w-[500px] items-center justify-center overflow-hidden rounded-lg bg-[#F5F5F5] shadow max-md:relative max-md:right-0 max-md:w-full'>
					<div className='absolute left-0 top-0 h-5 w-full bg-[#D3E3FD]'>
						<ul className='flex h-full items-center gap-2 px-3'>
							<li className='h-2.5 w-2.5 rounded-full bg-slate-300'></li>
							<li className='h-2.5 w-2.5 rounded-full bg-slate-300'></li>
							<li className='h-2.5 w-2.5 rounded-full bg-slate-300'></li>
						</ul>
					</div>
					<svg width='400px' stroke='url(#gradient)' strokeWidth={8} viewBox='0 0 900 300' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<defs>
							<radialGradient id='gradient' cx='0%' cy='0%' r='100%' gradientUnits='userSpaceOnUse'>
								<stop offset='0%' stopColor='#23D093' />
								<stop offset='75%' stopColor='#AFABF6' />
								<stop offset='100%' stopColor='#4CC8F3' />
							</radialGradient>
						</defs>

						<motion.path
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 3 }}
							strokeLinejoin='round'
							strokeLinecap='round'
							d='M95.15,142.61 C95.15,142.61 104.31,120.82 116.18,126.61 C134.92,135.75 107.81,212.16 67.95,270.92 C12.52,352.64 129.67,85.78 160.52,114.27 C191.37,142.76 117.97,188.31 122.24,154.92 C131.38,83.49 214.81,115.78 214.81,115.78 C175.38,116.64 147.75,163.33 173.81,166.78 C205.1,170.92 214.81,116.07 214.81,116.07 C214.81,116.07 199.81,160.78 217.81,164.78 C235.81,168.78 278.47,76.78 278.47,76.78 C278.47,76.78 229.67,161.78 263.81,165.78 C297.95,169.78 361.1,93.21 373.1,77.21 C385.1,61.21 368.7,34.29 334.7,87.29 C300.7,140.29 312.81,164.78 312.81,164.78 C312.81,164.78 353.81,133.78 355.81,139.78 C357.81,145.78 359.38,192.44 403.72,146.72 C448.07,101.01 221.1,96.07 221.1,96.07 '
						/>
						<motion.path
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 3, delay: 3 }}
							strokeLinejoin='round'
							d='M441.86,112.86 C438,138.72 428.17,160.46 428.17,160.46 C428.17,160.46 444.86,122.72 458.57,127.86 C472.29,133 463.83,145.37 463.15,166.15 C473.43,125 490.57,125 490.57,125 C490.57,125 482.86,153.86 494.86,157.86 C506.86,161.86 529.12,153.2 546.12,115.2 C546.12,115.2 518.86,159.86 533.86,162.86 C548.86,165.86 569.03,128.52 556.17,115.2 C542.75,101.3 547.04,153.68 566.86,151.86 C592.75,149.49 586.35,120.23 610.86,76.86 C592.75,124.35 574.55,155.12 605.55,164.12 C636.55,173.12 657.66,120.23 657.66,120.23 C657.66,120.23 631.69,167.12 662.69,164.12 C693.69,161.12 709.77,116.57 709.77,116.57 C709.77,116.57 677.86,164.86 696.86,163.86 C715.86,162.86 738.01,125.23 721.2,115.2 C695.15,99.66 716.42,162.32 735.37,154.06 C753.2,146.29 755.49,119.77 755.49,119.77 C755.49,119.77 755.95,138.52 746.35,161.37 C760.97,138.52 775.86,122.86 775.86,122.86 C775.86,122.86 775.13,202.39 817.43,149.57 C868.4,85.95 646.23,111.43 659.72,92.43 C673.2,73.43 674.57,110.72 639.15,113.57 C603.72,116.43 562,117.57 543.86,84.86 '
						/>
					</svg>
				</div>
			</div>
		</div>
	)
}
