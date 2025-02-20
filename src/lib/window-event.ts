type EventName = 'activate-point-controls'

export function addEventListener(eventName: EventName, handler: () => void) {
	window.addEventListener(eventName, handler)

	return () => window.removeEventListener(eventName, handler)
}

export function dispatchEvent(eventName: EventName) {
	window.dispatchEvent(new Event(eventName))
}
