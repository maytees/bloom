import type { Signal } from "../types";

export function signal<T>(defaultValue?: T): Signal<typeof defaultValue> {
	let value = defaultValue;

	return [
		(): typeof defaultValue => { return value },
		(newValue: typeof defaultValue): void => { value = newValue }
	]
}
