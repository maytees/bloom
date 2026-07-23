export type Signal<T> = [
	get: SignalGetter<T>,
	set: SignalSetter<T>
];

export type SignalSetter<T = undefined> = (value: T) => void;
export type SignalGetter<T = undefined> = () => T;
