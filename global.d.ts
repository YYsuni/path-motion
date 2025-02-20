declare module '*.svg' {
	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
	export default ReactComponent
}
declare module '*.svg?url' {
	const content: StaticImageData

	export default content
}
