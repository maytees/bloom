
import { expect, test } from "bun:test"
import { signal } from "./signal";

test("simple signal", () => {
	const [name] = signal()
	expect(name()).toBeUndefined()
});

test("signal with default value", () => {
	const [name] = signal("Maytham")
	expect(name()).toBe("Maytham")
});

test("no default value is undefined", () => {
	const [n] = signal()
	expect(n()).toBeUndefined()
});

test("update default value", () => {
	const [n, setN] = signal<number | null>(0)
	setN(5)
	expect(n()).toBe(5)
});

test("holds objects", () => {
	const obj = { a: 1 }
	const [get, set] = signal(obj)
	expect(get()).toBe(obj)
	set({ a: 2 })
	expect(get()).toEqual({ a: 2 })
})

test("two signals are independent", () => {
	const [_, setA] = signal("a")
	const [b] = signal("b")
	setA("a2")
	expect(b()).toBe("b")
})

test("returns updater function", () => {
	const [n, setN] = signal(0)
	expect(typeof setN).toBe("function")
	expect(typeof n).toBe("function")
})

test("can set to undefined and null", () => {
	const [n, setN] = signal<number | null>(0)
	setN(null)
	expect(n()).toBeNull()
})

test("updates multiple times", () => {
	const [n, setN] = signal(0)
	setN(1); setN(2); setN(3)
	expect(n()).toBe(3)
})

test("holds functions as values", () => {
	const fn = () => 42
	const [get] = signal(fn)
	expect(get()).toBe(fn)
})
