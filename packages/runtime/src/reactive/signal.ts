import type { Signal } from "../types";

export function signal<T = undefined>(defaultValue?: T): Signal<T> {
	let value = defaultValue;

	return (...args: T[]) => {
		if (args.length === 0) return value;
		value = args[0];

		// TODO: notify effects
	};
}
