declare module '*.svg' {
	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
	export default ReactComponent
}
declare module '*.svg?url' {
	const content: StaticImageData

	export default content
}

declare type PathRecord = {
	uid: string
	name: string
	points: string
	d: string
	theD: string
	closedPath: boolean
	timestamp: number
}
