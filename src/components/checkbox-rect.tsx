'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
	({ className, ...props }, ref) => (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cn(
				'focus-visible:ring-ring peer h-3 w-3 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brand data-[state=checked]:text-white',
				className
			)}
			{...props}>
			<CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
				<Check className='h-3 w-3' />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
