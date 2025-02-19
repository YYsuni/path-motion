import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
	title: 'Path Motion'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<head>
				<link rel='icon' href='/favicon.svg' />
			</head>
			<body>{children}</body>
		</html>
	)
}
